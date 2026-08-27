import { motion } from 'motion/react'
import { Plus } from 'lucide-react'

interface NewPageButtonProps {
  onClick: () => void
}

export default function NewPageButton({ onClick }: NewPageButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className="mx-4 mb-4 flex items-center gap-2.5 rounded-xl border border-border-paper/70 bg-paper px-4 py-3 text-sm font-medium text-ink-paper shadow-[0_2px_8px_rgba(23,21,16,0.18)] transition-[box-shadow] hover:shadow-[0_6px_18px_rgba(23,21,16,0.24)]"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-red text-paper">
        <Plus size={14} strokeWidth={2.5} />
      </span>
      New Learning Page
    </motion.button>
  )
}