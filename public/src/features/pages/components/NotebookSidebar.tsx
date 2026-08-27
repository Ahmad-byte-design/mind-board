import { useRef, useState } from 'react'
import { usePages } from '../hooks'
import { usePageSelection } from '../hooks'
import { cn } from '@/lib/utils'
import { SIDEBAR_MAX_WIDTH, SIDEBAR_MIN_WIDTH } from '../constants/pages.constants'
import NotebookPanel from './NotebookPanel'
import CollapsedRail from './CollapsedRail'
import CreatePageDialog from './CreatePageDialog'
import RenamePageDialog from './RenamePageDialog'
import DeletePageDialog from './DeletePageDialog'
import type { Page } from '../types/page.types'

interface NotebookSidebarProps {
  width: number
  collapsed: boolean
  isOnline: boolean
  onToggleCollapse: () => void
  onWidthChange: (width: number) => void
}

export default function NotebookSidebar({
  width,
  collapsed,
  isOnline,
  onToggleCollapse,
  onWidthChange,
}: NotebookSidebarProps) {
  const pagesQuery = usePages()
  const [createOpen, setCreateOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<Page | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Page | null>(null)

  const pages = pagesQuery.data?.pages.flatMap((group) => group.data) ?? []
  const { selectedPageId, selectPage } = usePageSelection({
    pages,
    isLoading: pagesQuery.isLoading,
  })

  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null)

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { startX: event.clientX, startWidth: width }
    event.currentTarget.setPointerCapture(event.pointerId)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    const nextWidth = dragRef.current.startWidth + (event.clientX - dragRef.current.startX)
    onWidthChange(Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, nextWidth)))
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  if (collapsed) {
    return (
      <>
        <CollapsedRail
          pages={pages}
          isLoading={pagesQuery.isLoading}
          selectedPageId={selectedPageId}
          isOnline={isOnline}
          onSelect={selectPage}
          onOpenCreate={() => setCreateOpen(true)}
          onExpand={onToggleCollapse}
        />
        <CreatePageDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      </>
    )
  }

  return (
    <aside className="relative shrink-0" style={{ width }}>
      <div className="flex h-dvh flex-col border-r border-wood-dark/60 shadow-[4px_0_28px_rgba(23,21,16,0.35)]">
        <NotebookPanel
          isOnline={isOnline}
          onCollapse={onToggleCollapse}
          onOpenCreate={() => setCreateOpen(true)}
          onRename={setRenameTarget}
          onDelete={setDeleteTarget}
        />
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          'group absolute right-0 top-0 z-20 flex h-full w-1.5 cursor-col-resize items-center justify-center touch-none transition-colors hover:bg-red/30',
        )}
      >
        <div className="h-10 w-[3px] rounded-full bg-wood-dark/60 transition-all group-hover:w-[5px] group-hover:bg-red" />
      </div>

      <CreatePageDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      {renameTarget && (
        <RenamePageDialog
          key={renameTarget.id}
          page={renameTarget}
          open={!!renameTarget}
          onClose={() => setRenameTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeletePageDialog
          page={deleteTarget}
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </aside>
  )
}