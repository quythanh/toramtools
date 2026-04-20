import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import type { MainQuest } from '@/types/exp.type';
import { buildMqDp, buildPercentDp, generateQuestName } from '@/utils/exp';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  mq: MainQuest[];
}

export default function ExpChart({ mq }: Props) {
  const chartRef = useRef<ChartJS<'line'> | null>(null);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false,
  );

  const chartData = useMemo(() => {
    if (mq.length === 0) return { labels: [], values: [] };

    const mqExps = mq.map((q) => q.exp);
    const mqDp = buildMqDp(mqExps);
    const percentDp = buildPercentDp(mqDp);

    return {
      labels: mq.map((q) => generateQuestName(q)),
      values: percentDp.map((r) => r[r.length - 1]),
    };
  }, [mq]);

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains('dark'));
    });
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    chart.options.scales!.y!.grid!.color = isDark
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(2, 6, 23, 0.08)';
    chart.options.scales!.y!.ticks!.color = isDark
      ? 'rgba(226, 232, 240, 0.9)'
      : 'rgba(15, 23, 42, 0.65)';
    chart.options.scales!.y!.title!.color = isDark ? '#e2e8f0' : '#0f172a';
    chart.options.plugins!.legend!.labels!.color = isDark
      ? '#e2e8f0'
      : '#0f172a';
    chart.data.datasets[0].borderColor = isDark
      ? 'rgba(59, 130, 246, 1)'
      : 'rgba(14, 165, 233, 1)';

    chart.update('none');
  }, [isDark]);

  return (
    <div className="mt-4 rounded-2xl border border-border/40 bg-background/30 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-sm font-bold text-foreground">
          EXP Percentage (Main Quest)
        </h3>
      </div>
      <div className="relative w-full aspect-5/3 overflow-hidden">
        <Line
          className="w-full h-full"
          ref={chartRef}
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: '% Exp on total',
                data: chartData.values,
                borderWidth: 2,
                borderColor: 'rgba(59, 130, 246, 1)',
                tension: 0.2,
                pointRadius: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
              x: {
                ticks: { display: false },
                grid: { display: false },
              },
              y: {
                beginAtZero: true,
                max: 100,
                grid: {
                  color: 'rgba(255, 255, 255, 0.08)',
                  drawTicks: false,
                },
                ticks: {
                  color: 'rgba(226, 232, 240, 0.9)',
                  font: { size: 10 },
                },
                title: {
                  display: true,
                  text: 'Percentage (%)',
                  color: '#e2e8f0',
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: '#e2e8f0',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
