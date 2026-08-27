import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { getCsrf } from '@/lib/axios'
import { QUERY_KEYS } from '@/constants/query.constants'
import { pagesApi } from '../../api/pages.api'
import type { CursorPaginated, Page } from '../../types/page.types'

interface UpdatePageVariables {
  id: number
  title: string
}

export function useUpdatePage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, title }: UpdatePageVariables) => {
      await getCsrf()
      return pagesApi.update(id, { title })
    },
    onSuccess: (updatedPage: Page) => {
      queryClient.setQueryData(
        QUERY_KEYS.PAGES.LIST,
        (old: InfiniteData<CursorPaginated<Page>, string | null> | undefined) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((item) => (item.id === updatedPage.id ? updatedPage : item)),
            })),
          }
        },
      )
    },
  })
}