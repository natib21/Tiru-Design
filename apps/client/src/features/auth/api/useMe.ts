import { useQuery } from '@tanstack/react-query';
import { client } from '@/shared/api';
import { authQueryKeys } from '../query-keys';

export function useMe() {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: async () => {
      const { data } = await client.GET('/auth/me');
      return data;
    },
  });
}
