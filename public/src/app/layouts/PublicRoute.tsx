import { Navigate } from 'react-router'
import { useAuth } from '@/features/auth/hooks'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { ROUTES } from '@/constants/routes.constants'
import { AuthSplash } from './AuthSplash'

interface PublicRouteProps {
  children: React.ReactNode
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuth()
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) {
    return <AuthSplash />
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.LEARNING} replace />
  }

  return <>{children}</>
}
