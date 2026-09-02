import { http, HttpResponse } from 'msw'
import { AUTH_ENDPOINTS } from '@/features/auth/constants/auth.constants'
import { createMockAuthResponse } from '@/test/factories'

export const authHandlers = [
  http.get('/sanctum/csrf-cookie', () => HttpResponse.text('', { status: 204 })),

  http.post(AUTH_ENDPOINTS.LOGIN, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }
    if (body.password && body.password.length < 6) {
      return HttpResponse.json(
        {
          message: 'These credentials do not match our records.',
          errors: { email: ['These credentials do not match our records.'] },
        },
        { status: 422 },
      )
    }
    return HttpResponse.json(createMockAuthResponse({ message: 'Login successful.' }), {
      status: 200,
    })
  }),

  http.post(AUTH_ENDPOINTS.REGISTER, async ({ request }) => {
    const formData = await request.formData()
    const email = String(formData.get('email') ?? '')
    if (email.includes('taken')) {
      return HttpResponse.json(
        {
          message: 'The email has already been taken.',
          errors: { email: ['The email has already been taken.'] },
        },
        { status: 422 },
      )
    }
    return HttpResponse.json(
      createMockAuthResponse({ message: 'Registration successful.', user: { name: String(formData.get('name') ?? '') } }),
      { status: 201 },
    )
  }),

  http.post(AUTH_ENDPOINTS.LOGOUT, () => HttpResponse.json({ message: 'Logged out successfully.' })),

  http.get(AUTH_ENDPOINTS.ME, () =>
    HttpResponse.json({ user: createMockAuthResponse().user }),
  ),

  http.post(AUTH_ENDPOINTS.PROFILE, async ({ request }) => {
    const formData = await request.formData()
    return HttpResponse.json(
      createMockAuthResponse({ user: { name: String(formData.get('name') ?? '') } }),
    )
  }),
]