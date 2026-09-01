import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Pencil, Save, X } from 'lucide-react'
import type { PaperCanvasData } from '../types/board.types'

interface PaperDetailsPanelProps {
  paper: PaperCanvasData | null
  onUpdate: (input: { content: string }) => void
  onClose: () => void
}

export default function PaperDetailsPanel({ paper, onUpdate, onClose }: PaperDetailsPanelProps) {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(paper?.content ?? '')

  return (
    <AnimatePresence>
      {paper ? (
        <motion.aside
          key={paper.id}
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="pointer-events-auto absolute right-3 top-3 z-[6] flex w-72 max-w-[calc(100%-1.5rem)] flex-col rounded-2xl border border-border-paper bg-paper shadow-[0_18px_50px_rgba(23,21,16,0.55)]"
        >
          <div className="flex items-start justify-between gap-2 px-4 pb-2 pt-3">
            <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full bg-red shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]" />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setEditing((value) => !value)}
                title={editing ? 'Done editing' : 'Edit concept'}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink-paper"
              >
                {editing ? <Save size={15} /> : <Pencil size={15} />}
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink-paper"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="px-4">
            {editing ? (
              <div className="space-y-2.5">
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={8}
                  className="w-full resize-none rounded-lg border border-border-paper bg-paper-muted/60 px-2.5 py-2 text-sm leading-relaxed text-ink-muted outline-none focus:border-red/50"
                  placeholder="Concept notes..."
                />
                <button
                  type="button"
                  onClick={() => onUpdate({ content })}
                  className="w-full rounded-lg bg-red py-2 text-sm font-semibold text-paper transition-colors hover:bg-red-deep"
                >
                  Save changes
                </button>
              </div>
            ) : (
              <p className="paper-ruled mb-1 pb-6 text-sm leading-[1.8] text-ink-muted">
                {paper.content}
              </p>
            )}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
