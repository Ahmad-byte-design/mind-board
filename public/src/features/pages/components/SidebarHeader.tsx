import { PanelLeftClose, X } from 'lucide-react'

interface SidebarHeaderProps {
  onCollapse: () => void
  onCloseMobile?: () => void
}

export default function SidebarHeader({ onCollapse, onCloseMobile }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-paper/60 bg-paper text-ink-paper shadow-sm">
          <span className="font-hand text-lg font-bold">m</span>
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[15px] font-semibold leading-tight text-ink-paper">
            Learning Notebook
          </h1>
          <p className="truncate font-mono text-[10px] tracking-wide text-ink-muted">
            Your learning world
          </p>
        </div>
      </div>

      {onCloseMobile ? (
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close notebook"
          className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink-paper"
        >
          <X size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse notebook"
          className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink-paper"
        >
          <PanelLeftClose size={18} />
        </button>
      )}
    </div>
  )
}