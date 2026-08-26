import { useAuthStore } from '../store/auth.store'

export function useAuth() {
  const { user, isAuthenticated, logout } = useAuthStore()

  return {
    user,
    isAuthenticated,
    logout,
  }
}
