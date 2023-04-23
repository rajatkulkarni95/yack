import { Store } from "tauri-plugin-store-api";
import { ChatMessageParams } from "../hooks/useChatCompletion";

export const store = new Store(".data.dat");

export type TUsage = {
  total_tokens: number;
};

export type THistoryMessageProps = {
  id: string;
  title: string;
  created: number;
};

export type THistory = {
  [key: string]: THistoryMessageProps;
};

export const setApiKey = async (apiKey: string) => {
  await store.set("api_key", apiKey);
  await store.save();
};

export const getApiKey = async () =>
  await store.get<Promise<string>>("api_key");

export const removeApiKey = async () => {
  await store.delete("api_key");
  await store.save();
};

export const getUsage = async () => await store.get<TUsage>("usage");

export const incrementUsage = async (usage: TUsage) => {
  const currentUsage: TUsage | null = await store.get("usage");
  console.log({ currentUsage, usage });

  if (currentUsage) {
    const { total_tokens } = currentUsage;
    await store.set("usage", {
      total_tokens: total_tokens + usage.total_tokens,
    });
  } else {
    await store.set("usage", usage);
  }
  await store.save();
};

export const saveConversation = async (
  conversation: ChatMessageParams[],
  chatId: string
) => {
  await store.set(chatId, conversation);
  await store.save();
};

export const getConversation = async (chatId: string) =>
  await store.get<Promise<ChatMessageParams[]>>(chatId);

export const saveConversationIDToHistory = async ({
  id,
  title,
  created,
}: THistoryMessageProps) => {
  const chatHistory: THistory | null = await store.get("history");
  if (chatHistory) {
    if (!(id in chatHistory)) {
      await store.set("history", {
        ...chatHistory,
        [id]: {
          title,
          created,
        },
      });
    }
  } else {
    await store.set("history", {
      [id]: {
        title,
        created,
      },
    });
  }
  await store.save();
};

export const getHistory = async () => await store.get<THistory>("history");
