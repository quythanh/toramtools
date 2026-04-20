import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import type { Level, MainQuest } from '@/types/exp.type';
import { Request } from '@/utils/request';

export const useGetLevelData = () =>
  useQuery<Level>({
    queryKey: ['level'],
    queryFn: () => {
      const params = new URLSearchParams({
        sheet: 'LV_Release_Date',
        latest: '1',
      });

      return Request.get(params);
    },
  });

export const useGetMainQuestData = () =>
  useSuspenseQuery<MainQuest[]>({
    queryKey: ['mq'],
    queryFn: () => {
      const params = new URLSearchParams({
        sheet: 'MQ_Exp',
      });

      return Request.get(params);
    },
  });

export const useGetSideQuestData = () =>
  useSuspenseQuery<[string, number][]>({
    queryKey: ['sq'],
    queryFn: () => {
      const params = new URLSearchParams({
        sheet: 'Quest_Exp',
      });

      return Request.get(params);
    },
  });
