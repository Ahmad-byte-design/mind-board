import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query.constants'
import { boardApi } from '../../api/board.api'

export function useBoardData(pageId: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.BOARD.DATA(pageId ?? 0),
    queryFn: () => boardApi.getBoard(pageId as number),
    enabled: pageId !== null,
  })
}
