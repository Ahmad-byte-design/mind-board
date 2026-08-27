import { motion } from 'motion/react'
import { btnHover } from '@/lib/motion'

type SecondaryBtnProps = React.ComponentProps<typeof motion.button>

export default function SecondaryBtn({ children, className = '', ...props }: SecondaryBtnProps) {
  return (
    <motion.button
      className={`rounded-lg border border-border-dark px-8 py-3.5 font-medium text-paper transition-colors hover:bg-surface-dark ${className}`}
      {...btnHover}
      {...props}
    >
      {children}
    </motion.button>
  )
}
