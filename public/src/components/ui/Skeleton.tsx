import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-paper-muted/60', className)}>
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-notebook/80 to-transparent"
        animate={{ x: ['-100%', '300%'] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 0.4,
        }}
      />
    </div>
  )
}