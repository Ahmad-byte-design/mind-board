import { useEffect } from 'react'
import { motion } from 'motion/react'
import { Eye, Pencil, Trash2 } from 'lucide-react'

export interface PaperContextMenuState {
  paperId: number
  x: number
  y: number
}

interface PaperContextMenuProps {
  menu: PaperContextMenuState
  onClose: () => void
  onView: (paperId: number) => void
  onEdit: (paperId: number) => void
  onDelete: (paperId: number) => void
}

export default function PaperContextMenu({
  menu,
  onClose,
  onView,
  onEdit,
  onDelete,
}: PaperContextMenuProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const itemClass =
    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink-paper transition-colors hover:bg-paper-muted'

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.12 }}
        className="absolute z-50 w-44 rounded-xl border border-border-paper bg-paper p-1.5 shadow-[0_14px_40px_rgba(23,21,16,0.5)]"
        style={{ left: menu.x, top: menu.y, transform: 'translate(8px, 8px)' }}
      >
        <button type="button" className={itemClass} onClick={() => onView(menu.paperId)}>
          <Eye size={15} className="text-ink-muted" /> View concept
        </button>
        <button type="button" className={itemClass} onClick={() => onEdit(menu.paperId)}>
          <Pencil size={15} className="text-ink-muted" /> Edit concept
        </button>
        <div className="my-1 h-px bg-border-paper/60" />
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-deep transition-colors hover:bg-red/10"
          onClick={() => onDelete(menu.paperId)}
        >
          <Trash2 size={15} /> Delete
        </button>
      </motion.div>
    </>
  )
}
