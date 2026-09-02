import { useTranslation } from 'react-i18next'
import { Dialog } from '@/components/ui'
import { Languages } from 'lucide-react'

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'de', label: 'Deutsch' },
  { code: 'tr', label: 'Türkçe' },
]

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { t, i18n } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose} title={t('settings.title')}>
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-wider text-ink-muted uppercase">
            <Languages size={14} />
            {t('settings.language')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  i18n.language === lang.code
                    ? 'border-gold bg-gold/15 text-ink-paper'
                    : 'border-border-paper bg-paper text-ink-muted hover:border-gold'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
