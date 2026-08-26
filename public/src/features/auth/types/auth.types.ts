export interface User {
  id: number
  name: string
  email: string
  avatar?: string | null
  createdAt: string
}

export interface AuthResponse {
  message: string
  user: User
}

export interface MeResponse {
  user: User
}

export type AuthMode = 'login' | 'signup'
