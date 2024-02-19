import { useCallback, useState } from "react";
import { SSE } from "sse";
import type { DeepRequired } from "../helpers/types";

export type GPT35 = "gpt-3.5-turbo" | "gpt-3.5-turbo-0301";
export type GPT4 = "gpt-4" | "gpt-4-0314" | "gpt-4-32k" | "gpt-4-32k-0314";
export type Model = GPT35 | GPT4;

export type ChatRole = "user" | "assistant" | "system" | "";

export type OpenAIChatMessage = {
  content: string; // content of the completion
  role: ChatRole; // role of the person/AI in the message
};

export type ChatMessageToken = OpenAIChatMessage & {
  timestamp: number;
};

export type ChatMessageParams = OpenAIChatMessage & {
  timestamp?: number; // The timestamp of when the completion finished
  meta?: {
    loading?: boolean; // If the completion is still being executed
    responseTime?: string; // The total elapsed time the completion took
    chunks?: ChatMessageToken[]; // The chunks returned as a part of streaming the execution of the completion
  };
};

export type ChatCompletionChunk = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    delta: Partial<OpenAIChatMessage>;
    index: number;
    finish_reason: string | null;
  }[];
};

export type ChatMessage = DeepRequired<ChatMessageParams>;

export type OpenAIStreamingProps = {
  apiKey: string;
  model: string;
  setErrorMessage: (message: string) => void;
};

type RequestOptions = {
  headers: Record<string, string>;
  method: "POST";
  payload: string;
};

const CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";
const MILLISECONDS_PER_SECOND = 1000;

const updateLastItem = <T>(currentItems: T[], updatedLastItem: T) => {
  const newItems = currentItems.slice(0, -1);
  newItems.push(updatedLastItem);
  return newItems;
};

// transform chat message structure with metadata to a limited shape that OpenAI API expects
const getOpenAIRequestMessage = ({
  content,
  role,
}: ChatMessage): OpenAIChatMessage => ({
  content,
  role,
});

const getRequestOptions = (
  apiKey: string,
  model: string,
  messages: ChatMessage[]
): RequestOptions => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  method: "POST",
  payload: JSON.stringify({
    model,
    messages: messages.map(getOpenAIRequestMessage),
    stream: true,
  }),
});

// transform chat message into a chat message with metadata
const createChatMessage = ({
  content,
  role,
  meta,
}: ChatMessageParams): ChatMessage => ({
  content,
  role,
  timestamp: Date.now(),
  meta: {
    loading: false,
    responseTime: "",
    chunks: [],
    ...meta,
  },
});

export const useChatCompletion = ({
  model,
  apiKey,
  setErrorMessage,
}: OpenAIStreamingProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [source, setSource] = useState<SSE>();

  const resetMessages = () => setMessages([]);
  const closeStream = useCallback(() => source?.close(), [source]);

  const handleChunk = useCallback(
    (event: { data: string; readyState: number }) => {
      // if [DONE] token is found, stream was finished
      if (event.data === "[DONE]") {
        closeStream();
        return;
      }

      try {
        const payload: ChatCompletionChunk = JSON.parse(event.data);
        const chunkContent: string = payload.choices[0].delta.content ?? "";
        const chunkRole: ChatRole = payload.choices[0].delta.role ?? "";

        // update last message entry in list with the most recent chunk
        setMessages((prevMessages) => {
          const lastIndex = prevMessages.length - 1;
          const updatedLastMessage = {
            content: `${prevMessages[lastIndex].content}${chunkContent}`,
            role: `${prevMessages[lastIndex].role}${chunkRole}` as ChatRole,
            timestamp: 0,
            meta: {
              ...prevMessages[lastIndex].meta,
              chunks: [
                ...prevMessages[lastIndex].meta.chunks,
                {
                  content: chunkContent,
                  role: chunkRole,
                  timestamp: Date.now(),
                },
              ],
            },
          };

          return updateLastItem(prevMessages, updatedLastMessage);
        });
      } catch (error) {
        console.error(`Error with JSON.parse and ${event.data}`, error);
      }
    },
    [closeStream]
  );

  const handleCloseStream = (startTimestamp: number) => {
    // Determine the final timestamp, and calculate the number of seconds the full request took.
    const endTimestamp = Date.now();
    const differenceInSeconds =
      (endTimestamp - startTimestamp) / MILLISECONDS_PER_SECOND;
    const formattedDiff = `${differenceInSeconds.toFixed(2)}s`;

    // update the messages list, specifically update the last message entry with the final
    // details of the full request/response.
    setMessages((prevMessages) => {
      const lastIndex = prevMessages.length - 1;
      const updatedLastMessage = {
        ...prevMessages[lastIndex],
        timestamp: endTimestamp,
        meta: {
          ...prevMessages[lastIndex].meta,
          loading: false,
          responseTime: formattedDiff,
        },
      };

      return updateLastItem(prevMessages, updatedLastMessage);
    });
  };

  const submitQuery = useCallback(
    (newPrompt: ChatMessageParams[]) => {
      // a) no new request if last stream is loading
      // b) no request if empty string as prompt
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.meta?.loading) return;

      // If the array is empty or there are no new messages submited, that is a special request to
      // clear the `messages` queue and prepare to start over, do not make a request.
      if (!newPrompt || newPrompt.length < 1) {
        setMessages([]);
        return;
      }

      const startTimestamp = Date.now();
      const chatMessages: ChatMessage[] = [
        ...messages,
        ...newPrompt.map(createChatMessage),
      ];

      const source = new SSE(
        CHAT_COMPLETIONS_URL,
        getRequestOptions(apiKey, model, chatMessages)
      );
      setSource(source);

      // placeholder for next message that will be returned from API
      const placeholderMessage = createChatMessage({
        content: "",
        role: "",
        meta: { loading: true },
      });
      setMessages([...chatMessages, placeholderMessage]);

      source.addEventListener("message", handleChunk);
      source.addEventListener("readystatechange", (event) => {
        // readyState: 0 - connecting, 1 - open, 2 - closed
        if (event.readyState === 2) {
          handleCloseStream(startTimestamp);
        }
      });

      source.addEventListener("error", (error) => {
        setErrorMessage(error.data);
        closeStream();
      });

      source.stream();
    },
    [apiKey, handleChunk, messages, model]
  );

  return [messages, submitQuery, resetMessages, closeStream] as const;
};
