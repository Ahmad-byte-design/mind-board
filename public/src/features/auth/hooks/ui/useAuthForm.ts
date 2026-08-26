import { useState } from 'react'
import type { AuthMode } from '../../types/auth.types'

export function useAuthForm(initialMode: AuthMode = 'login') {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [showPassword, setShowPassword] = useState(false)

  const isLogin = mode === 'login'

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
  }

  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  return {
    mode,
    isLogin,
    showPassword,
    toggleMode,
    togglePassword,
  }
}
