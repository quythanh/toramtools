import { getXP } from './getXP';

// XP needed to upgrade from level lv to level lv+1
export const buildXpDp = (max_size: number = 10_000) => {
  const n = max_size + 1;
  const dp = Array.from({ length: n }, () => Array<number>(n).fill(0));

  for (let j = 2; j < n; j++) dp[1][j] = getXP(j - 1);

  for (let i = 2; i < n; i++)
    for (let j = i + 1; j < n; j++) dp[i][j] = dp[i][j - 1] + dp[1][j];

  return dp;
};
