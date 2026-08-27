import { useState } from 'react'
import { toast } from 'sonner'
import { BookPlus } from 'lucide-react'
import { Dialog } from '@/components/ui'
import { useCreatePage } from '../hooks'
import { getApiError } from '@/lib/api-errors'
import PaperField from './PaperField'

interface CreatePageDialogProps {
  open: boolean
  onClose: () => void
}

export default function CreatePageDialog({ open, onClose }: CreatePageDialogProps) {
  const createPage = useCreatePage()
  const [title, setTitle] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    createPage.mutate(
      { title },
      {
        onSuccess: () => {
          toast.success('Page created.')
          setTitle('')
          onClose()
        },
        onError: (error) => toast.error(getApiError(error)),
      },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title="New learning page">
      <form onSubmit={handleSubmit} className="space-y-4">
        <PaperField
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. React Mastery"
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
            disabled={createPage.isPending || title.trim().length < 2}
            className="flex items-center gap-2 rounded-lg bg-red px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-red-deep disabled:opacity-50"
          >
            <BookPlus size={16} />
            {createPage.isPending ? 'Creating...' : 'Create page'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}