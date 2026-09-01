import { Navigate } from 'react-router'
import { useAuth } from '@/features/auth/hooks'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { AuthSplash } from './AuthSplash'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const isInitializing = useAuthStore((state) => state.isInitializing)

  if (isInitializing) {
    return <AuthSplash />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
