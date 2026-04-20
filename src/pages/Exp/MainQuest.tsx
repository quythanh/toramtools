import { Activity, lazy, Suspense, useMemo, useState } from 'react';
import Loading from '@/components/Loading';
import { VENENA_ID, VENENA_XP, xpDp } from '@/constants/exp';
import { useGetMainQuestData } from '@/queries/exp.query';
import type { PlayerStat } from '@/types/exp.type';
import { addXP, generateQuestName } from '@/utils/exp';
import { formatNumber } from '@/utils/number';
import Section from './Section';

const Chart = lazy(() => import('./Chart'));
const DiaryTable = lazy(() => import('./DiaryTable'));

interface Props {
  playerStat: PlayerStat;
}

export default function MainQuestSection({ playerStat }: Props) {
  const { data } = useGetMainQuestData();
  const [selectedMainQuest, setSelectedMainQuest] = useState({
    from: 0,
    to: data.length - 1,
  });
  const [questOptions, setQuestOptions] = useState({
    skipVenena: true,
    spamAdv: false,
  });

  const getTotalXP = useMemo(
    () => (begin: number, beginPercentage: number, end: number) =>
      Math.floor((1 - beginPercentage / 100) * xpDp[begin][begin + 1]) +
      xpDp[begin + 1][end],
    [],
  );

  const targetXP = useMemo(
    () => getTotalXP(playerStat.level, playerStat.percent, playerStat.target),
    [getTotalXP, playerStat],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: replace `data` with `isPending` in dependencies to avoid hook conditional
  const mqEval = useMemo(() => {
    if (selectedMainQuest.from > selectedMainQuest.to) {
      return {
        ok: false,
        error: 'Seems we have a time travel here',
      };
    }

    let mqXP = 0;
    let mqXPReverse = 0;
    let mqStopIndex = selectedMainQuest.from;
    let mqStartIndex = selectedMainQuest.to;
    let mqStopAt = false;
    let mqStartFrom = false;

    for (let i = selectedMainQuest.from; i <= selectedMainQuest.to; i++) {
      mqXP += data[i].exp;
      mqXPReverse +=
        data[selectedMainQuest.to - (i - selectedMainQuest.from)].exp;

      if (i === VENENA_ID && !questOptions.skipVenena) mqXP += VENENA_XP;
      if (
        selectedMainQuest.to - (i - selectedMainQuest.from) === VENENA_ID &&
        !questOptions.skipVenena
      )
        mqXPReverse += VENENA_XP;

      if (!mqStopAt && mqXP > targetXP) {
        mqStopAt = true;
        mqStopIndex = i;
      }

      if (!mqStartFrom && mqXPReverse > targetXP) {
        mqStartFrom = true;
        mqStartIndex = selectedMainQuest.to - (i - selectedMainQuest.from);
      }
    }

    const [reachLv, reachLvP] = addXP(
      playerStat.level,
      playerStat.percent,
      mqXP,
    );

    return {
      ok: true,
      xp: mqXP,
      reachLv,
      reachLvP,
      stopAtQuest: mqStopAt ? generateQuestName(data[mqStopIndex]) : null,
      startFromQuest: mqStartFrom
        ? generateQuestName(data[mqStartIndex])
        : null,
    };
  }, [
    selectedMainQuest,
    playerStat.level,
    playerStat.percent,
    questOptions.skipVenena,
    targetXP,
    generateQuestName,
  ]);

  return (
    <>
      <Section title="Main Quest">
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              className="block text-sm font-medium text-foreground/90 mb-1"
              htmlFor="mq-from"
            >
              From
            </label>
            <select
              id="mq-from"
              value={selectedMainQuest.from + 1}
              onChange={(e) =>
                setSelectedMainQuest((prev) => ({
                  ...prev,
                  from: Number(e.target.value) - 1,
                }))
              }
              className="w-full rounded-xl border border-border/60 bg-card/60 dark:bg-card/40 px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring/50"
            >
              {data.map((q) => (
                <option key={q.id} value={q.id}>
                  {generateQuestName(q)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-foreground/90 mb-1"
              htmlFor="mq-to"
            >
              Until
            </label>
            <select
              id="mq-to"
              value={selectedMainQuest.to + 1}
              onChange={(e) =>
                setSelectedMainQuest((prev) => ({
                  ...prev,
                  to: Number(e.target.value) - 1,
                }))
              }
              className="w-full rounded-xl border border-border/60 bg-card/60 dark:bg-card/40 px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring/50"
            >
              {data
                .map((q) => (
                  <option key={q.id} value={q.id}>
                    {generateQuestName(q)}
                  </option>
                ))
                .reverse()}
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-center gap-3 rounded-2xl border border-border/40 bg-background/40 p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={questOptions.skipVenena}
              onChange={(e) =>
                setQuestOptions((prev) => ({
                  ...prev,
                  skipVenena: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-border/60 text-primary focus:ring-ring/50"
            />
            <span className="text-sm font-medium text-foreground/90">
              Skip Pre-Venena Metacoenubia Fight
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-border/40 bg-background/40 p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={questOptions.spamAdv}
              onChange={(e) =>
                setQuestOptions((prev) => ({
                  ...prev,
                  spamAdv: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-border/60 text-primary focus:ring-ring/50"
            />
            <span className="text-sm font-medium text-foreground/90">
              Spam Adventurer&apos;s Diaries
            </span>
          </label>
        </div>

        <div className="mt-4 rounded-2xl border border-border/40 bg-background/40 p-4">
          {!mqEval.ok ? (
            <p className="text-sm text-muted-foreground italic">
              {mqEval.error}
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">XP</span>{' '}
                {mqEval ? formatNumber(mqEval.xp) : '...'}
              </p>
              <p className="mt-2 text-sm sm:text-base text-foreground/90">
                After doing Main Quest&apos;s above range you&apos;ll reach{' '}
                <span className="font-extrabold">
                  Lv.{mqEval.reachLv} ({mqEval.reachLvP}%)
                </span>
              </p>

              {/* Stop/start hints are hidden when spam-repeat is enabled */}
              {!questOptions.spamAdv &&
                mqEval.startFromQuest &&
                mqEval.stopAtQuest && (
                  <div className="mt-3 space-y-2">
                    {mqEval.startFromQuest && (
                      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm">
                        You may <span className="font-extrabold">start</span>{' '}
                        from quest{' '}
                        <span className="font-extrabold">
                          {mqEval.startFromQuest}
                        </span>{' '}
                        to reach target level
                      </div>
                    )}
                    {mqEval.stopAtQuest && mqEval.startFromQuest && (
                      <div className="text-center text-xs text-muted-foreground font-semibold">
                        OR
                      </div>
                    )}
                    {mqEval.stopAtQuest && (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">
                        You may <span className="font-extrabold">stop</span>{' '}
                        after quest{' '}
                        <span className="font-extrabold">
                          {mqEval.stopAtQuest}
                        </span>{' '}
                        to reach target level
                      </div>
                    )}
                  </div>
                )}
            </>
          )}
        </div>

        <Suspense fallback={<Loading />}>
          <Chart mq={data} />
        </Suspense>
      </Section>

      <Activity mode={questOptions.spamAdv ? 'visible' : 'hidden'}>
        <Section title="Result">
          <Suspense fallback={<Loading />}>
            <DiaryTable
              mq={data}
              targetXP={targetXP}
              playerStat={playerStat}
              selectedMainQuest={selectedMainQuest}
              questOptions={questOptions}
            />
          </Suspense>
        </Section>
      </Activity>
    </>
  );
}
