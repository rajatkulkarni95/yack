import { getApiKey } from "./store";

export default async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const apiKey = await getApiKey();

  if (!apiKey) {
    throw new Error("No token found");
  }

  const res = await fetch(input, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error.message);
  }
  return data;
}
