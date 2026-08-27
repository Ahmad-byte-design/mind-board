import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { getCsrf } from '@/lib/axios'
import { QUERY_KEYS } from '@/constants/query.constants'
import { pagesApi } from '../../api/pages.api'
import { usePagesStore } from '../../store/pages.store'
import type { CreatePageInput, CursorPaginated, Page } from '../../types/page.types'

export function useCreatePage() {
  const queryClient = useQueryClient()
  const setSelectedPageId = usePagesStore((state) => state.setSelectedPageId)

  return useMutation({
    mutationFn: async (input: CreatePageInput) => {
      await getCsrf()
      return pagesApi.create(input)
    },
    onSuccess: (newPage: Page) => {
      queryClient.setQueryData(
        QUERY_KEYS.PAGES.LIST,
        (old: InfiniteData<CursorPaginated<Page>, string | null> | undefined) => {
          if (!old || old.pages.length === 0) return old
          const [firstPage, ...rest] = old.pages
          return {
            ...old,
            pages: [{ ...firstPage, data: [newPage, ...firstPage.data] }, ...rest],
          }
        },
      )
      setSelectedPageId(newPage.id)
    },
  })
}