import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getCsrf } from '@/lib/axios'
import { QUERY_KEYS } from '@/constants/query.constants'
import { pagesApi } from '../../api/pages.api'
import { usePagesStore } from '../../store/pages.store'

export function useDeletePage() {
  const queryClient = useQueryClient()
  const selectedPageId = usePagesStore((state) => state.selectedPageId)
  const setSelectedPageId = usePagesStore((state) => state.setSelectedPageId)

  return useMutation({
    mutationFn: async (id: number) => {
      await getCsrf()
      return pagesApi.delete(id)
    },
    onSuccess: (_data, id) => {
      if (selectedPageId === id) setSelectedPageId(null)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAGES.LIST })
    },
  })
}