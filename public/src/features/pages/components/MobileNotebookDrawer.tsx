import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import NotebookPanel from './NotebookPanel'
import CreatePageDialog from './CreatePageDialog'
import RenamePageDialog from './RenamePageDialog'
import DeletePageDialog from './DeletePageDialog'
import type { Page } from '../types/page.types'

interface MobileNotebookDrawerProps {
  open: boolean
  isOnline: boolean
  onClose: () => void
}

export default function MobileNotebookDrawer({ open, isOnline, onClose }: MobileNotebookDrawerProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<Page | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Page | null>(null)

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40">
            <motion.button
              aria-label="Close notebook"
              className="absolute inset-0 cursor-default bg-ink-deep/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={onClose}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute inset-x-0 bottom-0 top-16 overflow-hidden rounded-t-3xl border-t border-wood-dark/60 shadow-[0_-16px_48px_rgba(0,0,0,0.45)]"
            >
              <NotebookPanel
                isOnline={isOnline}
                onCloseMobile={onClose}
                onSelectPage={onClose}
                onOpenCreate={() => setCreateOpen(true)}
                onRename={setRenameTarget}
                onDelete={setDeleteTarget}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CreatePageDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      {renameTarget && (
        <RenamePageDialog
          key={renameTarget.id}
          page={renameTarget}
          open={!!renameTarget}
          onClose={() => setRenameTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeletePageDialog page={deleteTarget} open={!!deleteTarget} onClose={() => setDeleteTarget(null)} />
      )}
    </>
  )
}