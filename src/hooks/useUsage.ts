export const useUsage = () => {
  // 100 tokens = 75 words
  // $1 = 100000 words
  // 1 token = 0.75 words
  // $1 = 75000 tokens
  const currentUsage = localStorage.getItem("usage");
  if (currentUsage) {
    const { prompt_tokens, completion_tokens, total_tokens } =
      JSON.parse(currentUsage);

    const cost = (tokens: number) => {
      return (tokens / 75000).toFixed(3);
    };

    const promptCost = cost(prompt_tokens);
    const completionCost = cost(completion_tokens);
    const totalCost = cost(total_tokens);

    return {
      promptCost,
      completionCost,
      totalCost,
    };
  }
  return {
    promptCost: 0,
    completionCost: 0,
    totalCost: 0,
  };
};
