import { motion } from 'motion/react'
import { BookOpen, MapPin } from 'lucide-react'
import type { Page } from '@/features/pages/types/page.types'

interface BoardPlaceholderProps {
  page: Page | null
  isMobile: boolean
  onOpenNotebook: () => void
}

export default function BoardPlaceholder({ page, isMobile, onOpenNotebook }: BoardPlaceholderProps) {
  return (
    <main className="wood-frame relative flex-1">
      <div className="cork-texture absolute inset-3 overflow-hidden rounded-2xl shadow-[inset_0_2px_16px_rgba(23,21,16,0.5)] sm:inset-4">
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          {page ? (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, rotate: -3, scale: 0.96 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative rotate-[-1deg] rounded-lg border border-border-paper/70 bg-paper px-10 py-5 shadow-[0_10px_28px_rgba(23,21,16,0.45)]"
            >
              <span className="absolute -top-1 left-1/4 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-red shadow-[0_1px_3px_rgba(0,0,0,0.45)]" />
              <span className="absolute -top-1 right-1/4 h-2.5 w-2.5 translate-x-1/2 rounded-full bg-red shadow-[0_1px_3px_rgba(0,0,0,0.45)]" />
              <h1 className="font-hand text-4xl font-semibold text-ink-paper lg:text-5xl">{page.title}</h1>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border-paper/50 bg-paper/10 text-paper/80">
                <MapPin size={36} strokeWidth={1.5} />
              </span>
              <h2 className="font-hand text-3xl font-semibold text-paper lg:text-4xl">
                Your board, waiting for you.
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/70">
                Select a learning page or create a new one to start pinning concepts and stitching
                them together.
              </p>
            </div>
          )}

          <div className="mt-16 max-w-md rounded-xl border border-paper/20 bg-paper/5 px-6 py-4 backdrop-blur-[1px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
              The cork board is coming together
            </p>
            <p className="mt-1.5 text-sm text-paper/70">
              Papers and red strings will appear here soon — this is where your knowledge map lives.
            </p>
          </div>
        </div>
      </div>

      {isMobile && (
        <motion.button
          type="button"
          onClick={onOpenNotebook}
          aria-label="Open learning notebook"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.94 }}
          className="absolute bottom-5 right-5 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border-paper/40 bg-notebook text-ink-paper shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        >
          <BookOpen size={24} />
        </motion.button>
      )}
    </main>
  )
}