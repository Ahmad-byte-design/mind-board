import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Dialog, Form, Input, PrimaryBtn } from '@/components/ui'
import { useAuth, useUpdateProfile } from '@/features/auth/hooks'
import { Avatar } from '@/components/ui'
import { getApiError, getApiFieldErrors } from '@/lib/api-errors'

interface ProfileDialogProps {
  open: boolean
  onClose: () => void
}

export default function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const updateMutation = useUpdateProfile()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!user) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    updateMutation.mutate(
      { name, email, avatar: avatar ?? undefined },
      {
        onSuccess: () => {
          toast.success(t('profile.success'))
          onClose()
        },
        onError: (error) => {
          const fields = getApiFieldErrors(error)
          if (Object.keys(fields).length > 0) {
            setFieldErrors(fields)
          } else {
            toast.error(getApiError(error))
          }
        },
      }
    )
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('profile.title')}>
      <Form onSubmit={handleSubmit}>
        <Avatar preview={user.avatar} onChange={setAvatar} size="md" />

        <Input
          variant="light"
          label={t('profile.name')}
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />
        <Input
          variant="light"
          label={t('profile.email')}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />

        <PrimaryBtn
          disabled={updateMutation.isPending}
          loading={updateMutation.isPending}
        >
          {t('profile.save')}
        </PrimaryBtn>
      </Form>
    </Dialog>
  )
}
