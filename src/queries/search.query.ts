import { useMutation, useQuery } from '@tanstack/react-query';
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

export const useSearchItems = () =>
  useMutation<Page<Item>, Error, SearchPayload>({
    mutationFn: (data) =>
      Request.post(new URLSearchParams({ sheet: 'Items' }), {
        sheet: 'Items',
        ...data,
      }),
  });
