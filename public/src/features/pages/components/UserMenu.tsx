import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router'
import { DropdownMenu } from '@/components/ui'
import { useAuth, useLogout } from '@/features/auth/hooks'
import { ROUTES } from '@/constants/routes.constants'

export default function UserMenu() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const logoutMutation = useLogout()

  if (!user) {
    return null
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || '?'

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        navigate(ROUTES.LOGIN)
      },
    })
  }

  return (
    <DropdownMenu
      align="left"
      trigger={() => (
        <button
          type="button"
          aria-label="Account menu"
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border-paper/60 bg-paper text-sm font-semibold text-ink-paper shadow-sm transition-colors hover:bg-paper-muted"
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <span>{initial}</span>
          )}
        </button>
      )}
      items={[
        {
          label: user.name,
          onSelect: () => {},
        },
        {
          label: 'Log out',
          icon: <LogOut size={16} />,
          danger: true,
          onSelect: handleLogout,
        },
      ]}
    />
  )
}
