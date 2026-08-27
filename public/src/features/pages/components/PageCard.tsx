import { motion } from 'motion/react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import PageActionsMenu from './PageActionsMenu'
import type { Page } from '../types/page.types'

interface PageCardProps {
  page: Page
  active: boolean
  onSelect: () => void
  onRename: () => void
  onDelete: () => void
}

export default function PageCard({ page, active, onSelect, onRename, onDelete }: PageCardProps) {
  const metaParts: string[] = []
  if (typeof page.conceptsCount === 'number') metaParts.push(`${page.conceptsCount} concepts`)
  if (typeof page.progress === 'number') metaParts.push(`${page.progress}%`)

  const updatedAt = page.updatedAt ? new Date(page.updatedAt) : null
  const updatedLabel =
    updatedAt && !Number.isNaN(updatedAt.getTime())
      ? `updated ${formatDistanceToNow(updatedAt, { addSuffix: true })}`
      : 'updated recently'

  const metaText =
    metaParts.length > 0 ? `${metaParts.join(' · ')} · ${updatedLabel}` : `Updated ${updatedLabel}`

  return (
    <motion.div
      whileHover={{ y: -2, rotate: 0.6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      onClick={onSelect}
      className={cn(
        'group relative cursor-pointer rounded-xl border px-4 py-3 transition-colors',
        active
          ? 'border-string/30 bg-gradient-to-br from-paper via-paper to-paper-muted shadow-[0_10px_24px_rgba(23,21,16,0.3)]'
          : 'border-border-paper/60 bg-paper/90 shadow-[0_2px_8px_rgba(23,21,16,0.16)] hover:shadow-[0_6px_18px_rgba(23,21,16,0.22)]',
        active && '-rotate-[0.5deg]',
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            'mt-1.5 block shrink-0 rounded-full transition-all',
            active
              ? 'h-2.5 w-2.5 bg-red shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.35)]'
              : 'h-2 w-2 bg-red/40 group-hover:bg-red/60',
          )}
        />

        <div className="min-w-0 flex-1">
          <h4 className="truncate font-hand text-lg font-semibold leading-tight text-ink-paper">
            {page.title}
          </h4>
          <p className="mt-0.5 truncate font-mono text-[10px] tracking-wide text-ink-muted">{metaText}</p>
        </div>

        <div
          className={cn(
            '-mr-1 -mt-1 flex translate-y-0.5 opacity-0 transition-opacity duration-150',
            'group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100',
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <PageActionsMenu onRename={onRename} onDelete={onDelete} />
        </div>
      </div>
    </motion.div>
  )
}