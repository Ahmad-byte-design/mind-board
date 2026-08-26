import type { MotionProps } from 'motion/react'

export const fadeUp: MotionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export const fadeIn: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 },
}

export const btnHover: MotionProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
}

export const btnSubtle: MotionProps = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.99 },
}

export const noteSway = (dir: 1 | -1): MotionProps => ({
  animate: { rotate: [dir * -2, dir * 2, dir * -2] },
  transition: { duration: 4 + dir, repeat: Infinity, ease: 'easeInOut' as const },
})
