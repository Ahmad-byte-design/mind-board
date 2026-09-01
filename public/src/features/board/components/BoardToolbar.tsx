import { motion } from 'motion/react'
import { PanelRight, Plus, Scan, Sparkles, Trash2 } from 'lucide-react'
import type { ReactFlowInstance } from '@xyflow/react'

interface BoardToolbarProps {
  selectedPaperId: number | null
  movablePaperId: number | null
  isDetailsPanelOpen: boolean
  rfInstance: ReactFlowInstance | null
  onNewPaper: () => void
  onDelete: () => void
  onToggleDetails: () => void
  onGenerate: () => void
}

const buttonBase =
  'flex h-9 w-9 items-center justify-center rounded-xl border border-border-paper/50 bg-paper/95 text-ink-paper shadow-[0_3px_10px_rgba(23,21,16,0.3)] transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40'

export default function BoardToolbar({
  selectedPaperId,
  movablePaperId,
  isDetailsPanelOpen,
  rfInstance,
  onNewPaper,
  onDelete,
  onToggleDetails,
  onGenerate,
}: BoardToolbarProps) {
  const hasSelection = selectedPaperId !== null

  return (
    <div className=" absolute left-1/2 top-3 z-5 flex -translate-x-1/2 items-center gap-1.5 rounded-2xl border border-border-paper/40 bg-paper/80 p-1.5 shadow-[0_8px_24px_rgba(23,21,16,0.4)] backdrop-blur-sm">
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onGenerate}
        title="Generate board with AI"
        aria-label="Generate board with AI"
        className={buttonBase}
      >
        <Sparkles size={16} />
      </motion.button>
      <div className="mx-0.5 h-5 w-px bg-border-paper/70" />
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onNewPaper}
        title="New paper"
        aria-label="New paper"
        className={buttonBase}
      >
        <Plus size={16} />
      </motion.button>
      <div className="mx-0.5 h-5 w-px bg-border-paper/70" />
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onDelete}
        disabled={!hasSelection}
        title="Delete selected paper"
        aria-label="Delete selected paper"
        className={buttonBase}
      >
        <Trash2 size={16} />
      </motion.button>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onToggleDetails}
        disabled={!hasSelection || movablePaperId === selectedPaperId}
        title="Toggle concept details"
        aria-label="Toggle concept details"
        className={buttonBase}
      >
        <PanelRight size={15} />
      </motion.button>
      <div className="mx-0.5 h-5 w-px bg-border-paper/70" />
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => rfInstance?.fitView({ padding: 0.2, duration: 400 })}
        title="Fit view"
        aria-label="Fit view"
        className={buttonBase}
      >
        <Scan size={15} />
      </motion.button>
      {isDetailsPanelOpen ? <span className="sr-only">details open</span> : null}
    </div>
  )
}
