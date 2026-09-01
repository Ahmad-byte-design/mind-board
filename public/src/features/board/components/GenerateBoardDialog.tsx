import { Sparkles } from 'lucide-react'
import { Dialog } from '@/components/ui'

interface GenerateBoardDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export default function GenerateBoardDialog({
  open,
  onClose,
  onConfirm,
  isPending,
}: GenerateBoardDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Generate board with AI?">
      <p className="text-sm leading-relaxed text-ink-muted">
        AI will turn your page topic into a visual knowledge map — papers connected with red strings,
        laid out and ready to explore.
      </p>
      <p className="mt-2 rounded-xl bg-paper-muted/70 px-3 py-2 text-xs leading-relaxed text-ink-muted">
        Only works on an empty board. Any existing papers will be rejected by the server.
      </p>
      <div className="flex items-center justify-end gap-2 pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink-paper disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-red px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-red-deep disabled:opacity-50"
        >
          <Sparkles size={16} />
          {isPending ? 'Generating...' : 'Generate with AI'}
        </button>
      </div>
    </Dialog>
  )
}