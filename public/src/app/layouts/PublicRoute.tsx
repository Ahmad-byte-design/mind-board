import { Navigate } from 'react-router'
import { useAuth } from '@/features/auth/hooks'
import { ROUTES } from '@/constants/routes.constants'

interface PublicRouteProps {
  children: React.ReactNode
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={ROUTES.LEARNING} replace />
  }

  return <>{children}</>
}
