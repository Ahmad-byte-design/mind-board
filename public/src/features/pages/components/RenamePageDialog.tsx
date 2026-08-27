import { useState } from 'react'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import { Dialog } from '@/components/ui'
import { useUpdatePage } from '../hooks'
import { getApiError } from '@/lib/api-errors'
import PaperField from './PaperField'
import type { Page } from '../types/page.types'

interface RenamePageDialogProps {
  page: Page
  open: boolean
  onClose: () => void
}

export default function RenamePageDialog({ page, open, onClose }: RenamePageDialogProps) {
  const updatePage = useUpdatePage()
  const [title, setTitle] = useState(page.title)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updatePage.mutate(
      { id: page.id, title },
      {
        onSuccess: () => {
          toast.success('Page renamed.')
          onClose()
        },
        onError: (error) => toast.error(getApiError(error)),
      },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="Rename page">
      <form onSubmit={handleSubmit} className="space-y-4">
        <PaperField
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Page title"
          maxLength={60}
          required
        />
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink-paper"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updatePage.isPending || title.trim().length < 2}
            className="flex items-center gap-2 rounded-lg bg-red px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-red-deep disabled:opacity-50"
          >
            <Check size={16} />
            {updatePage.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}