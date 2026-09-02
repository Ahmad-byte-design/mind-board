import api from '@/lib/axios'
import { AUTH_ENDPOINTS } from '../constants/auth.constants'
import type { LoginFormData, RegisterFormData, UpdateProfilePayload } from '../schemas/auth.schema'
import type { AuthResponse, MeResponse } from '../types/auth.types'

export const authApi = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, data)
    return response.data
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('password_confirmation', data.password_confirmation)
    if (data.avatar) {
      formData.append('avatar', data.avatar)
    }
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post(AUTH_ENDPOINTS.LOGOUT)
  },

  getCurrentUser: async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>(AUTH_ENDPOINTS.ME)
    return response.data
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<AuthResponse> => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    if (data.avatar) {
      formData.append('avatar', data.avatar)
    }
    formData.append('_method', 'PUT')
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.PROFILE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}
