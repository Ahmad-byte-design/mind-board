import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { usePages } from '../hooks'
import { useInView } from '@/hooks/useInView'
import PageCard from './PageCard'
import PageCardSkeleton from './PageCardSkeleton'
import NotebookEmptyState from './NotebookEmptyState'
import type { Page } from '../types/page.types'

interface PageListProps {
  selectedPageId: number | null
  onSelect: (id: number) => void
  onRename: (page: Page) => void
  onDelete: (page: Page) => void
  onCreate: () => void
}

export default function PageList({ selectedPageId, onSelect, onRename, onDelete, onCreate }: PageListProps) {
  const pagesQuery = usePages()
  const { ref: sentinelRef, isInView: sentinelVisible } = useInView<HTMLDivElement>('160px')

  const pages = pagesQuery.data?.pages.flatMap((group) => group.data) ?? []
  const isLoadingInitial = pagesQuery.isLoading
  const isFetchingNext = pagesQuery.isFetchingNextPage
  const hasNext = pagesQuery.hasNextPage
  const isEmpty = pagesQuery.isSuccess && pages.length === 0

  useEffect(() => {
    if (sentinelVisible && hasNext && !isFetchingNext && !pagesQuery.isError) {
      void pagesQuery.fetchNextPage()
    }
  }, [sentinelVisible, hasNext, isFetchingNext, pagesQuery])

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-4">
      {!isLoadingInitial && !isEmpty && (
        <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">My pages</p>
      )}

      <div className="space-y-2.5">
        {isLoadingInitial &&
          [0, 1, 2].map((index) => <PageCardSkeleton key={`initial-${index}`} />)}

        {pagesQuery.isError && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border-paper/60 bg-paper/70 px-4 py-6 text-center">
            <p className="text-sm font-medium text-ink-paper">Couldn't load more pages.</p>
            <button
              type="button"
              onClick={() => void pagesQuery.refetch()}
              className="flex items-center gap-1.5 rounded-lg border border-border-paper/70 bg-paper px-3.5 py-1.5 text-xs font-medium text-ink-paper transition-colors hover:bg-paper-muted"
            >
              <RefreshCw size={13} />
              Try Again
            </button>
          </div>
        )}

        {isEmpty && <NotebookEmptyState onCreate={onCreate} />}

        {pages.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            active={page.id === selectedPageId}
            onSelect={() => onSelect(page.id)}
            onRename={() => onRename(page)}
            onDelete={() => onDelete(page)}
          />
        ))}

        {isFetchingNext &&
          [0, 1].map((index) => <PageCardSkeleton key={`next-${index}`} />)}
      </div>

      <div ref={sentinelRef} aria-hidden className="h-px" />

      {!isLoadingInitial && !isFetchingNext && !hasNext && pages.length > 0 && (
        <p className="mt-4 text-center font-mono text-[10px] tracking-wide text-ink-muted/80">
          You've reached the end of your notebook.
        </p>
      )}
    </div>
  )
}