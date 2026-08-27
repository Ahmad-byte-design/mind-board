import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import { DropdownMenu } from '@/components/ui'
import { cn } from '@/lib/utils'

interface PageActionsMenuProps {
  onRename: () => void
  onDelete: () => void
}

export default function PageActionsMenu({ onRename, onDelete }: PageActionsMenuProps) {
  return (
    <DropdownMenu
      trigger={(isOpen) => (
        <span
          role="button"
          tabIndex={0}
          aria-label="Page actions"
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-paper-muted ',
            isOpen ? 'bg-paper-muted text-ink-paper' : 'text-ink-muted',
          )}
        >
          <EllipsisVertical size={16} />
        </span>
      )}
      items={[
        { label: 'Rename', icon: <Pencil size={15} />, onSelect: onRename },
        { label: 'Delete', icon: <Trash2 size={15} />, danger: true, onSelect: onDelete },
      ]}
    />
  )
}