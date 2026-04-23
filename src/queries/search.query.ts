import { useQuery } from '@tanstack/react-query';
import type { Page } from '@/types';
import type { Item, SearchPayload } from '@/types/search.type';
import { Request } from '@/utils/request';

export const useGetEffectData = () =>
  useQuery<Record<string, number>>({
    queryKey: ['effect'],
    queryFn: () => {
      const params = new URLSearchParams({
        sheet: 'Effects',
      });

      return Request.get(params);
    },
  });

export const useGetItemTypesData = () =>
  useQuery<Record<string, number>>({
    queryKey: ['item-types'],
    queryFn: () => {
      const params = new URLSearchParams({
        sheet: 'ItemType',
      });

      return Request.get(params);
    },
  });

export const useSearchItems = (data: SearchPayload | null) => {
  const page = data?.page ?? 1;
  const pageSize = data?.pageSize ?? 10;
  const types = data?.types ? [...data.types] : [];
  const stats = data?.stats ? [...data.stats] : [];

  types.sort();
  stats.sort((a, b) => a[0] - b[0]);

  return useQuery<Page<Item>, Error>({
    queryKey: [
      'search-items',
      page,
      pageSize,
      types.toString(),
      stats.toString(),
    ],
    queryFn: () =>
      Request.post(new URLSearchParams({ sheet: 'Items' }), {
        sheet: 'Items',
        ...data,
      }),
    enabled: !!data,
  });
};
