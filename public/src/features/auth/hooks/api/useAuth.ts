import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCsrf } from '@/lib/axios'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/auth.store'
import { QUERY_KEYS } from '@/constants/query.constants'
import type { AuthResponse } from '../../types/auth.types'
import type { RegisterFormData } from '../../schemas/auth.schema'

export function useLogin() {
  const { setUser } = useAuthStore()

  return useMutation<AuthResponse, Error, { email: string; password: string; remember: boolean }>({
    mutationFn: async (data) => {
      await getCsrf()
      return authApi.login(data)
    },
    onSuccess: (data) => {
      setUser(data.user)
    },
  })
}

export function useRegister() {
  const { setUser } = useAuthStore()

  return useMutation<AuthResponse, Error, RegisterFormData>({
    mutationFn: async (data) => {
      await getCsrf()
      return authApi.register(data)
    },
    onSuccess: (data) => {
      setUser(data.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()

  return useMutation<void, Error, void>({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout()
      queryClient.clear()
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: async () => {
      const response = await authApi.getCurrentUser()
      return response.user
    },
    retry: false,
  })
}
