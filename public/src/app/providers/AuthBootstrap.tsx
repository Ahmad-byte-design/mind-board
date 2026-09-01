import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store/auth.store'

export default function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return <>{children}</>
}
