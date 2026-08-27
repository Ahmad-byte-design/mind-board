import { useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query.constants'
import { pagesApi } from '../../api/pages.api'

export function usePages() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.PAGES.LIST,
    queryFn: ({ pageParam }) => pagesApi.list(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor,
  })
}