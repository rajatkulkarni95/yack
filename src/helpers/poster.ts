import { TMessage } from "../pages/chat/[id]";

type TBody = {
  model: string;
  messages: TMessage[];
};

export default async function poster<JSON = any>(
  input: RequestInfo,
  body: TBody
): Promise<JSON> {
  const apiKey = localStorage.getItem("api_key");

  if (!apiKey) {
    throw new Error("No token found");
  }

  const res = await fetch(input, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error.message);
  }
  return data;
}
