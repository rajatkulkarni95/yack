import { useEffect, useState } from "react";
import { getUsage } from "../helpers/store";

export const useUsage = () => {
  // 100 tokens = 75 words
  // $1 = 100000 words
  // 1 token = 0.75 words
  // $1 = 75000 tokens
  const [totalCost, setTotalCost] = useState("0.000");

  useEffect(() => {
    async function calcCost() {
      const usage = await getUsage();
      if (usage) {
        const { total_tokens } = usage;

        const cost = (tokens: number) => {
          return (tokens / 75000).toFixed(3);
        };

        const totalCost = cost(total_tokens);

        setTotalCost(totalCost);
      }
    }

    calcCost();
  });

  return { totalCost };
};
