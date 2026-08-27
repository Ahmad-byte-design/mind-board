import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Dialog } from '@/components/ui'
import { useDeletePage } from '../hooks'
import { getApiError } from '@/lib/api-errors'
import type { Page } from '../types/page.types'

interface DeletePageDialogProps {
  page: Page
  open: boolean
  onClose: () => void
}

export default function DeletePageDialog({ page, open, onClose }: DeletePageDialogProps) {
  const deletePage = useDeletePage()

  const handleDelete = () => {
    deletePage.mutate(page.id, {
      onSuccess: () => {
        toast.success('Page deleted.')
        onClose()
      },
      onError: (error) => toast.error(getApiError(error)),
    })
  }

  return (
    <Dialog open={open} onClose={onClose} title="Delete this page?">
      <p className="text-sm leading-relaxed text-ink-muted">
        <span className="font-medium text-ink-paper">“{page.title}”</span> and everything on its board will be
        removed. This can’t be undone.
      </p>
      <div className="flex items-center justify-end gap-2 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink-paper"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deletePage.isPending}
          className="flex items-center gap-2 rounded-lg bg-red-deep px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-red disabled:opacity-50"
        >
          <Trash2 size={16} />
          {deletePage.isPending ? 'Deleting...' : 'Delete page'}
        </button>
      </div>
    </Dialog>
  )
}