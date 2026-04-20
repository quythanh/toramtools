import {
  type ComponentProps,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Loading from '@/components/Loading';
import { useGetLevelData } from '@/queries/exp.query';
import type { PlayerStat } from '@/types/exp.type';
import { cn } from '@/utils';
import { getTotalXP } from '@/utils/exp/getTotalXP';
import { formatNumber } from '@/utils/number';
import Hero from './Hero';

const Section = lazy(() => import('./Section'));
const MainQuest = lazy(() => import('./MainQuest'));
const SideQuest = lazy(() => import('./SideQuest'));

const UIMode = {
  MAIN_QUEST: 1,
  SIDE_QUEST: 2,
};
type UIModeType = (typeof UIMode)[keyof typeof UIMode];

export default function Xp() {
  const { data: levelData, isPending: isFetchingLevel } = useGetLevelData();
  const [mode, setMode] = useState<UIModeType>(UIMode.MAIN_QUEST);
  const [playerStat, setPlayerStat] = useState<PlayerStat>({
    level: 1,
    percent: 0,
    target: 1,
  });

  const xpRequired = useMemo(
    () => getTotalXP(playerStat.level, playerStat.percent, playerStat.target),
    [playerStat],
  );

  useEffect(() => {
    if (!levelData) return;
    setPlayerStat((prev) => ({ ...prev, target: levelData.level }));
  }, [levelData]);

  return (
    <div className="mx-auto max-w-3xl px-4">
      <Hero />

      <div className="space-y-6">
        {isFetchingLevel ? (
          <Loading />
        ) : (
          <Suspense fallback={<Loading />}>
            <Section title="Level">
              <div className="grid grid-cols-3 py-2 gap-1 w-fit mx-auto">
                <Input
                  id="level"
                  title="Lv"
                  min={1}
                  value={playerStat.level}
                  onChange={(e) =>
                    setPlayerStat((prev) => ({
                      ...prev,
                      level: Number(e.target.value),
                    }))
                  }
                />
                <Input
                  id="level-percentage"
                  title="%"
                  min={0}
                  max={99}
                  value={playerStat.percent}
                  onChange={(e) =>
                    setPlayerStat((prev) => ({
                      ...prev,
                      percent: Number(e.target.value),
                    }))
                  }
                />
                <Input
                  id="target-level"
                  title="TargetLv"
                  min={1}
                  max={10_000}
                  value={playerStat.target}
                  onChange={(e) =>
                    setPlayerStat((prev) => ({
                      ...prev,
                      target: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="text-center">
                <b>Total XP required</b>:{' '}
                <span>{formatNumber(xpRequired)}</span>
              </div>
            </Section>
          </Suspense>
        )}

        {/* Mode switch */}
        <div className="flex gap-2">
          <label
            className={cn(
              'flex-1 cursor-pointer rounded-xl px-3 py-2 text-center border transition-colors',
              mode === UIMode.MAIN_QUEST
                ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                : 'bg-card/50 border-border/40 text-foreground/80 hover:bg-accent/20',
            )}
          >
            <input
              className="sr-only"
              type="radio"
              name="ui-select"
              checked={mode === UIMode.MAIN_QUEST}
              onChange={() => setMode(UIMode.MAIN_QUEST)}
            />
            Main Quest
          </label>
          <label
            className={cn(
              'flex-1 cursor-pointer rounded-xl px-3 py-2 text-center border transition-colors',
              mode === UIMode.SIDE_QUEST
                ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                : 'bg-card/50 border-border/40 text-foreground/80 hover:bg-accent/20',
            )}
          >
            <input
              className="sr-only"
              type="radio"
              name="ui-select"
              checked={mode === UIMode.SIDE_QUEST}
              onChange={() => setMode(UIMode.SIDE_QUEST)}
            />
            Side Quest
          </label>
        </div>

        <Suspense fallback={<Loading />}>
          {mode === UIMode.MAIN_QUEST && <MainQuest playerStat={playerStat} />}
          {mode === UIMode.SIDE_QUEST && (
            <SideQuest playerStat={playerStat} xpRequired={xpRequired} />
          )}
        </Suspense>
      </div>
    </div>
  );
}

function Input({ id, ...props }: ComponentProps<'input'>) {
  return (
    <div className="flex items-center">
      <label
        className="block text-sm font-medium text-foreground/90 mb-1"
        htmlFor={id}
      >
        {props.title}
      </label>
      &nbsp;
      <input
        id={id}
        type="number"
        className={cn(
          'w-12 text-foreground text-center outline-none',
          'py-1',
          'rounded-xl',
          'bg-card/60 dark:bg-card/40',
          'border border-border focus:border-primary',
        )}
        {...props}
      />
    </div>
  );
}
