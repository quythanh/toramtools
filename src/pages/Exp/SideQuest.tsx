import { useState } from 'react';
import { useGetSideQuestData } from '@/queries/exp.query';
import type { PlayerStat } from '@/types/exp.type';
import { addXP } from '@/utils/exp';
import Section from './Section';

interface Props {
  playerStat: PlayerStat;
  xpRequired: number;
}

export default function SideQuest({ playerStat, xpRequired }: Props) {
  const { data: sideQuestData } = useGetSideQuestData();
  const [quest, setQuest] = useState({
    id: 4,
    exp: sideQuestData[4][1],
    times: 1,
  });

  const times = quest.exp > 0 ? Math.ceil(xpRequired / quest.exp) : undefined;
  const [reachLv, reachLvPercent] = addXP(
    playerStat.level,
    playerStat.percent,
    quest.exp * quest.times,
  );

  return (
    <Section title="Side Quest">
      <div className="mt-4">
        <label
          className="block text-sm font-medium text-foreground/90 mb-1"
          htmlFor="quest-name"
        >
          Quest
        </label>
        <select
          id="quest-name"
          value={quest.id}
          onChange={(e) =>
            setQuest((prev) => {
              const questId = Number(e.target.value);
              const questExp = sideQuestData?.[questId]?.[1] ?? 0;
              return { ...prev, id: questId, exp: questExp };
            })
          }
          className="w-full rounded-xl border border-border/60 bg-card/60 dark:bg-card/40 px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring/50"
        >
          {sideQuestData?.map(([name], i) => (
            <option key={name} value={i}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <label
            className="block text-sm font-medium text-foreground/90 mb-1"
            htmlFor="quest-exp"
          >
            Exp
          </label>
          <input
            id="quest-exp"
            type="number"
            min={0}
            value={quest.exp}
            onChange={(e) =>
              setQuest((prev) => ({ ...prev, exp: Number(e.target.value) }))
            }
            className="w-full rounded-xl border border-border/60 bg-card/60 dark:bg-card/40 px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground/90 mb-1"
            htmlFor="quest-times"
          >
            N° of Times
          </label>
          <input
            id="quest-times"
            type="number"
            inputMode="numeric"
            min={0}
            value={quest.times}
            onChange={(e) =>
              setQuest((prev) => ({
                ...prev,
                times: Number(e.target.value),
              }))
            }
            className="w-full rounded-xl border border-border/60 bg-card/60 dark:bg-card/40 px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-1 items-center rounded-2xl border border-border/40 bg-background/40 p-4">
          <div>
            <div className="text-sm text-muted-foreground">
              Repeat this quest
            </div>
            <div className="text-2xl font-extrabold mt-1">{times ?? '∞'}</div>
            <div className="text-sm text-muted-foreground mt-1">
              times to reach target level
            </div>
          </div>
        </div>
        <div className="flex-1 rounded-2xl border border-border/40 bg-background/40 p-4">
          <p className="text-sm text-muted-foreground mb-2">
            By doing this quest for{' '}
            <span className="font-semibold text-foreground">{quest.times}</span>{' '}
            times, you'll reach:
          </p>
          <p className="text-lg sm:text-xl font-extrabold text-foreground">
            Level {reachLv} ({reachLvPercent}%)
          </p>
        </div>
      </div>
    </Section>
  );
}
