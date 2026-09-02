import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { BookPlus } from 'lucide-react'
import { Dialog } from '@/components/ui'
import { useCreatePage } from '../hooks'
import { getApiError } from '@/lib/api-errors'
import PaperField from './PaperField'
import { createPageSchema, type CreatePageFormData } from '../schemas/page.schema'

interface CreatePageDialogProps {
  open: boolean
  onClose: () => void
}

export default function CreatePageDialog({ open, onClose }: CreatePageDialogProps) {
  const { t } = useTranslation()
  const createPage = useCreatePage()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreatePageFormData>({
    resolver: zodResolver(createPageSchema),
    defaultValues: { title: '' },
  })

  const title = watch('title')

  const onSubmit = handleSubmit(({ title: value }) => {
    createPage.mutate(
      { title: value },
      {
        onSuccess: () => {
          toast.success(t('dialogs.createPage.success'))
          reset()
          onClose()
        },
        onError: (error) => toast.error(getApiError(error)),
      },
    )
  })

  return (
    <Dialog open={open} onClose={onClose} title={t('dialogs.createPage.title')}>
      <form onSubmit={onSubmit} className="space-y-4">
        <PaperField
          autoFocus
          error={errors.title?.message}
          placeholder={t('dialogs.createPage.placeholder')}
          maxLength={60}
          required
          {...register('title')}
        />
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink-paper"
          >
            {t('dialogs.createPage.cancel')}
          </button>
          <button
            type="submit"
            disabled={createPage.isPending || title.trim().length < 2}
            className="flex items-center gap-2 rounded-lg bg-red px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-red-deep disabled:opacity-50"
          >
            <BookPlus size={16} />
            {createPage.isPending ? t('dialogs.createPage.creating') : t('dialogs.createPage.create')}
          </button>
        </div>
      </form>
    </Dialog>
  )
}