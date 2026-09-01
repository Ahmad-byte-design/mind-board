import { motion } from 'motion/react'
import type { BoardSaveStatus } from '../types/board.types'

interface BoardStatusProps {
  status: BoardSaveStatus
  error?: string | null
  onRetry: () => void
}

export default function BoardStatus({ status, error, onRetry }: BoardStatusProps) {
  if (status === 'saving') {
    return (
      <div className="flex items-center gap-2 rounded-full border border-border-paper/40 bg-paper/90 px-3 py-1.5 text-xs text-ink-muted shadow-[0_4px_14px_rgba(23,21,16,0.3)]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
        Saving...
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 rounded-full border border-red/40 bg-paper/95 px-3 py-1 text-xs text-ink-paper shadow-[0_4px_14px_rgba(23,21,16,0.35)]">
        <span className="font-mono text-[10px] uppercase tracking-wide text-red-deep">
          Couldn&apos;t save changes
        </span>
        {error ? <span className="text-ink-muted">· {error}</span> : null}
        <button
          type="button"
          onClick={onRetry}
          className="ml-1 rounded-full bg-red px-2.5 py-0.5 text-[11px] font-semibold text-paper transition-colors hover:bg-red-deep"
        >
          Retry
        </button>
      </div>
    )
  }

  if (status === 'saved') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-1.5 rounded-full border border-green/30 bg-paper/90 px-3 py-1 text-xs text-green shadow-[0_4px_14px_rgba(23,21,16,0.3)]"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
          <path
            d="M3 8.5 6.5 12 13 4.5"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Saved
      </motion.div>
    )
  }

  return null
}
