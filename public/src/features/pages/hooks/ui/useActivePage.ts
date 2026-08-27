import { usePages } from '../api/usePages'
import { usePagesStore } from '../../store/pages.store'
import type { Page } from '../../types/page.types'

export function useActivePage(): { activePage: Page | null; isLoading: boolean } {
  const pagesQuery = usePages()
  const selectedPageId = usePagesStore((state) => state.selectedPageId)

  const pages = pagesQuery.data?.pages.flatMap((group) => group.data) ?? []
  const activePage = pages.find((page) => page.id === selectedPageId) ?? pages[0] ?? null

  return { activePage, isLoading: pagesQuery.isLoading }
}