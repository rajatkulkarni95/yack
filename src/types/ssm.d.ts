declare module "sse" {
  class SSE {
    constructor(
      url: string,
      options?: {
        headers: Record<string, string>;
        method: "POST";
        payload: string;
      }
    );
    addEventListener(
      event: string,
      listener: (event: { data: string; readyState: number }) => void
    ): void;
    stream(): void;
    close(): void;
  }

  export { SSE };
}
