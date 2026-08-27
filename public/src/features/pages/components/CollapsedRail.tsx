import { Plus, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Page } from '../types/page.types'

interface CollapsedRailProps {
  pages: Page[]
  isLoading: boolean
  selectedPageId: number | null
  isOnline: boolean
  onSelect: (id: number) => void
  onOpenCreate: () => void
  onExpand: () => void
}

export default function CollapsedRail({
  pages,
  isLoading,
  selectedPageId,
  isOnline,
  onSelect,
  onOpenCreate,
  onExpand,
}: CollapsedRailProps) {
  return (
    <aside className="notebook-texture flex h-dvh w-18 flex-col items-center border-r border-wood-dark/60 py-5">
      <button
        type="button"
        onClick={onExpand}
        aria-label="Expand notebook"
        className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg border border-border-paper/60 bg-paper text-ink-paper shadow-sm transition-colors hover:bg-paper-muted"
      >
        <span className="font-hand text-lg font-bold">m</span>
      </button>

      <button
        type="button"
        onClick={onExpand}
        aria-label="Expand notebook"
        className="mb-4 rounded-lg p-2 text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink-paper"
      >
        <PanelLeftOpen size={18} />
      </button>

      <button
        type="button"
        onClick={onOpenCreate}
        aria-label="New learning page"
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-border-paper/70 bg-paper text-ink-paper shadow-[0_2px_8px_rgba(23,21,16,0.18)] transition-colors hover:bg-paper-muted"
      >
        <Plus size={18} />
      </button>

      <div className="flex flex-1 flex-col items-center gap-3 overflow-y-auto no-scrollbar">
        {!isLoading &&
          pages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => onSelect(page.id)}
              aria-label={page.title}
              title={page.title}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full transition-all',
                page.id === selectedPageId
                  ? 'bg-red shadow-[0_2px_6px_rgba(0,0,0,0.35)]'
                  : 'bg-ink-muted/20 hover:bg-ink-muted/30',
              )}
            >
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  page.id === selectedPageId ? 'bg-paper' : 'bg-ink-muted',
                )}
              />
            </button>
          ))}
        {isLoading && [0, 1, 2].map((index) => <span key={index} className="h-2.5 w-2.5 animate-pulse rounded-full bg-ink-muted/30" />)}
      </div>

      <span
        className={cn(
          'mt-4 h-2 w-2 rounded-full',
          isOnline ? 'bg-green' : 'bg-yellow ring-2 ring-yellow/30',
        )}
        title={isOnline ? 'Online' : 'Offline'}
      />
    </aside>
  )
}