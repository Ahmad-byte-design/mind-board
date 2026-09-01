import { PanelLeftClose, X } from 'lucide-react'
import { Image } from '@/components/ui'
import logo from '@/assets/images/logo.png'

interface SidebarHeaderProps {
  onCollapse: () => void
  onCloseMobile?: () => void
}

export default function SidebarHeader({ onCollapse, onCloseMobile }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <Image
          src={logo}
          alt="Loom"
          className="h-9 w-9 shrink-0 rounded-lg object-cover shadow-sm"
        />
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