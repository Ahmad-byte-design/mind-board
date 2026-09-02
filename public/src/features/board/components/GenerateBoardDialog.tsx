import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose} title={t('dialogs.generateBoard.title')}>
      <p className="text-sm leading-relaxed text-ink-muted">
        {t('dialogs.generateBoard.description')}
      </p>
      <p className="mt-2 rounded-xl bg-paper-muted/70 px-3 py-2 text-xs leading-relaxed text-ink-muted">
        {t('dialogs.generateBoard.warning')}
      </p>
      <div className="flex items-center justify-end gap-2 pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-paper-muted hover:text-ink-paper disabled:opacity-50"
        >
          {t('dialogs.generateBoard.cancel')}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-red px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-red-deep disabled:opacity-50"
        >
          <Sparkles size={16} />
          {isPending ? t('dialogs.generateBoard.generating') : t('dialogs.generateBoard.generate')}
        </button>
      </div>
    </Dialog>
  )
}