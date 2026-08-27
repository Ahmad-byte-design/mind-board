import { motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'
import { CloudOff } from 'lucide-react'

interface OfflineNoticeProps {
  isOnline: boolean
  isSidebarCollapsed?: boolean
}

export default function OfflineNotice({ isOnline, isSidebarCollapsed = false }: OfflineNoticeProps) {
  return (
    <div className="px-4 pb-3">
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {isSidebarCollapsed ? (
              <div className="flex flex-col items-center gap-1 pb-2 text-ink-muted" title="Offline">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-muted">
                  <CloudOff size={14} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-border-paper/60 bg-paper/70 px-3 py-2">
                <CloudOff size={14} className="shrink-0 text-ink-muted" />
                <span className="font-mono text-[10px] tracking-wide text-ink-muted">
                  Offline — reconnecting…
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}