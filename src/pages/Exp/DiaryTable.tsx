import { useMemo } from 'react';
import { VENENA_ID, VENENA_XP, xpDp } from '@/constants/exp';
import type { MainQuest, PlayerStat } from '@/types/exp.type';
import { addXP, buildMqDp, generateQuestName, isHasVenena } from '@/utils/exp';
import { getTotalXP } from '@/utils/exp/getTotalXP';

interface Props {
  mq: MainQuest[];
  targetXP: number;
  playerStat: PlayerStat;
  selectedMainQuest: {
    from: number;
    to: number;
  };
  questOptions: {
    skipVenena: boolean;
    spamAdv: boolean;
  };
}

export default function DiaryTable({
  mq,
  targetXP,
  playerStat,
  selectedMainQuest,
  questOptions,
}: Props) {
  const mqDp = useMemo(() => buildMqDp(mq.map((q) => q.exp)), [mq]);
  const calcMqExp = useMemo(
    () => (begin: number, end: number) => {
      const venenaXP =
        isHasVenena(begin, end) && !questOptions.skipVenena ? VENENA_XP : 0;
      return mqDp[begin][end] + venenaXP;
    },
    [mqDp, questOptions.skipVenena],
  );
  const diariesEval = useMemo(() => {
    if (selectedMainQuest.from > selectedMainQuest.to) {
      return {
        ok: false,
        error: `Invalid quest range: from ${selectedMainQuest.from} to ${selectedMainQuest.to}`,
      };
    }

    const mqExp = calcMqExp(selectedMainQuest.from, selectedMainQuest.to);
    const runs = Math.floor(targetXP / mqExp);

    if (runs > 100)
      return {
        ok: false,
        error: `Too many runs required ${runs + 1}, select a wider range between quests.`,
      };

    const rows = [];
    let lv = playerStat.level;
    let lvP = playerStat.percent;
    for (let i = 1; i <= runs; i++) {
      [lv, lvP] = addXP(lv, lvP, mqExp);
      rows.push({
        num: i,
        finalChapter: generateQuestName(mq[selectedMainQuest.to]),
        lv,
        lvP,
      });
    }

    const exact_runs = runs === Math.ceil(targetXP / mqExp);
    if (!exact_runs) {
      let mqStopIndex = selectedMainQuest.from;
      let curXP =
        getTotalXP(playerStat.level, playerStat.percent, lv) +
        (lvP / 100) * xpDp[lv + 1][lv + 2];
      let stackedXP = 0;

      for (let i = selectedMainQuest.from; i <= selectedMainQuest.to; i++) {
        curXP += mq[i].exp;
        stackedXP += mq[i].exp;
        if (i === VENENA_ID && !questOptions.skipVenena) {
          curXP += VENENA_XP;
          stackedXP += mq[i].exp;
        }
        if (curXP > targetXP) {
          mqStopIndex = i;
          [lv, lvP] = addXP(lv, lvP, stackedXP);
          break;
        }
      }

      rows.push({
        num: runs + 1,
        finalChapter: generateQuestName(mq[mqStopIndex]),
        lv: lv,
        lvP: lvP,
      });
    }

    return {
      ok: true,
      rows,
    };
  }, [
    targetXP,
    playerStat,
    selectedMainQuest,
    questOptions.skipVenena,
    mq,
    calcMqExp,
  ]);

  return (
    <div className="rounded-2xl border border-border/40 bg-background/40 p-3 sm:p-4">
      {!diariesEval.ok ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-900 dark:text-red-100">
          {diariesEval.error}
        </div>
      ) : diariesEval?.rows?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-130 w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground text-xs uppercase tracking-wide">
                <th className="py-2 pr-2">N°</th>
                <th className="py-2 pr-2">Final Chapter</th>
                <th className="py-2 pr-2">Lv (%)</th>
              </tr>
            </thead>
            <tbody>
              {diariesEval.rows?.map((row) => (
                <tr
                  key={row.num}
                  className="border-t border-border/40 hover:bg-accent/20 transition-colors"
                >
                  <td className="py-2 pr-2 font-semibold">{row.num}</td>
                  <td className="py-2 pr-2">{row.finalChapter}</td>
                  <td className="py-2 pr-2 font-semibold">
                    {row.lv} ({row.lvP}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Enter a valid MQ range to see repeated-run results.
        </div>
      )}
    </div>
  );
}
