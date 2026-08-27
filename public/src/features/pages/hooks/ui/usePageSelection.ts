import { useEffect } from 'react'
import { usePagesStore } from '../../store/pages.store'
import type { Page } from '../../types/page.types'

interface UsePageSelectionOptions {
  pages: Page[]
  isLoading: boolean
}

export function usePageSelection({ pages, isLoading }: UsePageSelectionOptions) {
  const selectedPageId = usePagesStore((state) => state.selectedPageId)
  const setSelectedPageId = usePagesStore((state) => state.setSelectedPageId)

  useEffect(() => {
    if (isLoading || pages.length === 0) return
    if (!pages.some((page) => page.id === selectedPageId)) {
      setSelectedPageId(pages[0].id)
    }
  }, [pages, selectedPageId, isLoading, setSelectedPageId])

  const selectedPage = pages.find((page) => page.id === selectedPageId) ?? null

  const selectPage = (id: number) => setSelectedPageId(id)

  return { selectedPage, selectedPageId, selectPage }
}