import { TConversation } from "../pages/chat/[id]";

export type TUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export const incrementUsage = (usage: TUsage) => {
  const currentUsage = localStorage.getItem("usage");
  if (currentUsage) {
    const { prompt_tokens, completion_tokens, total_tokens } =
      JSON.parse(currentUsage);
    localStorage.setItem(
      "usage",
      JSON.stringify({
        prompt_tokens: prompt_tokens + usage.prompt_tokens,
        completion_tokens: completion_tokens + usage.completion_tokens,
        total_tokens: total_tokens + usage.total_tokens,
      })
    );
  } else {
    localStorage.setItem("usage", JSON.stringify(usage));
  }
};

export const saveConversation = (
  conversation: TConversation[],
  chatId: string
) => {
  const chatConversations = localStorage.getItem(chatId);
  if (chatConversations) {
    const parsed = JSON.parse(chatConversations);
    localStorage.setItem(
      chatId,
      JSON.stringify({
        ...parsed,
        messages: [...parsed.messages, ...conversation],
      })
    );
  }
};

export type THistoryMessageProps = {
  id: string;
  title: string;
  created: Date;
};

export const saveConversationIDToHistory = ({
  id,
  title,
  created,
}: THistoryMessageProps) => {
  const chatHistory = localStorage.getItem("history");
  if (chatHistory) {
    const parsed = JSON.parse(chatHistory);

    if (!(id in parsed)) {
      localStorage.setItem(
        "history",
        JSON.stringify({
          ...parsed,
          [id]: {
            messages: title,
            created,
          },
        })
      );
    }
  }
};
