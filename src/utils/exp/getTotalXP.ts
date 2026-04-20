import { xpDp } from '@/constants/exp';

export const getTotalXP = (
  begin: number,
  beginPercentage: number,
  end: number,
) =>
  Math.floor((1 - beginPercentage / 100) * xpDp[begin][begin + 1]) +
  xpDp[begin + 1][end];
