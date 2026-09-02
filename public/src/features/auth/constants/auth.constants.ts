export const AUTH_ENDPOINTS = {
  CSRF: '/sanctum/csrf-cookie',
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  LOGOUT: '/api/v1/auth/logout',
  ME: '/api/v1/auth/me',
  PROFILE: '/api/v1/auth/profile',
} as const
