import { create } from 'zustand'
import { authApi } from '../api/auth.api'
import type { User } from '../types/auth.types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
  setUser: (user: User | null) => void
  setInitializing: (value: boolean) => void
  initializeAuth: () => Promise<User | null>
  logout: () => void
}

let initializationPromise: Promise<User | null> | null = null

function is401Error(error: unknown): boolean {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { status?: number } }).response
    return response?.status === 401
  }
  return false
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setInitializing: (value) => set({ isInitializing: value }),

  initializeAuth: () => {
    if (initializationPromise) {
      return initializationPromise
    }

    set({ isInitializing: true })

    initializationPromise = (async (): Promise<User | null> => {
      try {
        const response = await authApi.getCurrentUser()
        set({ user: response.user, isAuthenticated: true })
        return response.user
      } catch (error) {
        if (is401Error(error)) {
          set({ user: null, isAuthenticated: false })
        }
        return get().user
      } finally {
        set({ isInitializing: false })
      }
    })()

    return initializationPromise
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
}))
