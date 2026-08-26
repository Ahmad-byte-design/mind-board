import { motion } from 'motion/react'
import { btnSubtle } from '@/lib/motion'

interface PrimaryBtnProps extends React.ComponentProps<typeof motion.button> {
  loading?: boolean
}

export default function PrimaryBtn({ children, loading, className = '', disabled, ...props }: PrimaryBtnProps) {
  return (
    <motion.button
      type="submit"
      disabled={disabled || loading}
      className={`flex w-full items-center justify-center gap-2 rounded-lg bg-red py-3.5 font-medium text-paper transition-colors hover:bg-red-deep disabled:opacity-50 ${className}`}
      {...btnSubtle}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </motion.button>
  )
}
