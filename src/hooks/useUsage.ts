export const useUsage = () => {
  // 100 tokens = 75 words
  // $1 = 100000 words
  // 1 token = 0.75 words
  // $1 = 75000 tokens
  const currentUsage = localStorage.getItem("usage");
  if (currentUsage) {
    const { total_tokens } = JSON.parse(currentUsage);

    const cost = (tokens: number) => {
      return (tokens / 75000).toFixed(3);
    };

    const totalCost = cost(total_tokens);

    return {
      totalCost,
    };
  }
  return {
    totalCost: 0,
  };
};
