import { ChatMessageParams } from "../hooks/useChatCompletion";

export type TUsage = {
  total_tokens: number;
};

export const incrementUsage = (usage: TUsage) => {
  const currentUsage = localStorage.getItem("usage");
  if (currentUsage) {
    const { total_tokens } = JSON.parse(currentUsage);
    localStorage.setItem(
      "usage",
      JSON.stringify({
        total_tokens: total_tokens + usage.total_tokens,
      })
    );
  } else {
    localStorage.setItem("usage", JSON.stringify(usage));
  }
};

export const saveConversation = (
  conversation: ChatMessageParams[],
  chatId: string
) => {
  localStorage.setItem(chatId, JSON.stringify(conversation));
};

export type THistoryMessageProps = {
  id: string;
  title: string;
  created: number;
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
            title,
            created,
          },
        })
      );
    }
  }
};

export const baseSetups = () => {
  const chatHistory = localStorage.getItem("history");
  if (!chatHistory) {
    localStorage.setItem("history", JSON.stringify({}));
  }

  const usage = localStorage.getItem("usage");
  if (!usage) {
    localStorage.setItem("usage", JSON.stringify({ total_tokens: 0 }));
  }
};
