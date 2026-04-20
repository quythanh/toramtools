import { VENENA_ID } from '@/constants/exp';
import type { MainQuest } from '@/types/exp.type';
import { getXP } from './getXP';

/**
 * Builds a Dynamic Programming (DP) table to calculate Main Quest experience gains.
 * * This function generates a 2D matrix where the value at `dp[i][j]` represents
 * the total accumulated XP earned starting from quest index `i` through quest index `j`.
 *
 * * @example
 * const questXp = [100, 200, 300];
 * const dpTable = build_mq_dp(questXp);
 * // dpTable[0][2] equals 600 (100 + 200 + 300)
 * // dpTable[1][2] equals 500 (200 + 300)
 */
export const buildMqDp = (list_xp: number[]) => {
  if (!list_xp || list_xp.length === 0) return [];

  const n = list_xp.length;
  const dp = Array.from({ length: n }, () => Array<number>(n).fill(0));

  for (let i = 0; i < n; i++)
    for (let j = i; j < n; j++)
      // Base case: XP from a quest to itself is just its own value
      if (i === j) dp[i][j] = list_xp[i];
      // Recurrence relation: sum of previous range plus current quest XP
      else dp[i][j] = dp[i][j - 1] + list_xp[j];

  return dp;
};

export const buildPercentDp = (mqDp: number[][]) =>
  mqDp.map((row) =>
    row.map((xp) => +((xp / mqDp[0][mqDp.length - 1]) * 100).toFixed(2)),
  );

export const addXP = (
  begin: number,
  beginPercentage: number,
  extraXP: number,
) => {
  const XPRequiredNextLv = (1 - beginPercentage / 100) * getXP(begin);
  if (extraXP < XPRequiredNextLv) {
    const currentXP = (beginPercentage / 100) * getXP(begin) + extraXP;
    return [begin, Math.floor((100 * currentXP) / getXP(begin))];
  }

  let remainingXP = extraXP - XPRequiredNextLv;
  let lv = begin + 1;
  while (getXP(lv) <= remainingXP) remainingXP -= getXP(lv++);
  const lvPercentage = Math.floor((100 * remainingXP) / getXP(lv));
  return [lv, lvPercentage];
};

export const generateQuestName = (quest: MainQuest) =>
  `CH${quest.chapter} - ${quest.name}`;

export const isHasVenena = (mqBegin: number, mqEnd: number) =>
  mqBegin <= VENENA_ID && mqEnd >= VENENA_ID;
