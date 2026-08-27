import { motion } from 'motion/react'
import { BookOpen, Plus } from 'lucide-react'

interface NotebookEmptyStateProps {
  onCreate: () => void
}

export default function NotebookEmptyState({ onCreate }: NotebookEmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border-paper/60 bg-paper/70 px-6 py-12 text-center shadow-sm">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-notebook text-ink-muted shadow-inner"
      >
        <BookOpen size={30} strokeWidth={1.5} />
      </motion.div>

      <h3 className="font-hand text-3xl font-semibold text-ink-paper">Your notebook is empty.</h3>
      <p className="mt-2 max-w-52 text-sm leading-relaxed text-ink-muted">
        Start with something you want to learn.
      </p>

      <button
        onClick={onCreate}
        className="mt-6 flex items-center gap-2 rounded-xl bg-red px-5 py-2.5 text-sm font-medium text-paper shadow-md transition-colors hover:bg-red-deep"
      >
        <Plus size={16} />
        Create Your First Page
      </button>
    </div>
  )
}