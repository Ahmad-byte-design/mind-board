import { beforeEach, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { authApi } from '../api/auth.api'
import { AUTH_ENDPOINTS } from '../constants/auth.constants'
import { createMockUser } from '@/test/factories'

const calls: { method: string; url: string; body: unknown }[] = []

beforeEach(() => {
  calls.length = 0
})

describe('authApi.login', () => {
  it('POSTs the credentials to the login endpoint', async () => {
    server.use(
      http.post(AUTH_ENDPOINTS.LOGIN, async ({ request }) => {
        calls.push({ method: request.method, url: String(request.url), body: await request.json() })
        return HttpResponse.json({ message: 'Login successful.', user: createMockUser({ id: 9 }) })
      }),
    )

    const result = await authApi.login({ email: 'a@b.co', password: 'secret12', remember: true })

    expect(calls).toHaveLength(1)
    expect(calls[0].method).toBe('POST')
    expect(calls[0].url).toContain('/api/v1/auth/login')
    expect(calls[0].body).toEqual({ email: 'a@b.co', password: 'secret12', remember: true })
    expect(result.user.id).toBe(9)
  })

  it('propagates server errors', async () => {
    server.use(
      http.post(AUTH_ENDPOINTS.LOGIN, () =>
        HttpResponse.json(
          { message: 'These credentials do not match our records.', errors: { email: ['These credentials do not match our records.'] } },
          { status: 422 },
        ),
      ),
    )

    await expect(
      authApi.login({ email: 'bad@example.com', password: 'wrong!1', remember: false }),
    ).rejects.toMatchObject({ response: { status: 422 } })
  })
})

describe('authApi.register', () => {
  it('POSTs multipart form data with the registration fields', async () => {
    server.use(
      http.post(AUTH_ENDPOINTS.REGISTER, async ({ request }) => {
        calls.push({ method: request.method, url: String(request.url), body: null })
        const form = await request.formData()
        calls[0] = {
          method: request.method,
          url: String(request.url),
          body: {
            name: form.get('name'),
            email: form.get('email'),
            password: form.get('password'),
            password_confirmation: form.get('password_confirmation'),
          },
        }
        return HttpResponse.json({ message: 'Registration successful.', user: createMockUser() }, { status: 201 })
      }),
    )

    await authApi.register({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret12',
      password_confirmation: 'secret12',
    })

    expect(calls[0].method).toBe('POST')
    expect(calls[0].url).toContain('/api/v1/auth/register')
    expect(calls[0].body).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret12',
      password_confirmation: 'secret12',
    })
  })

  it('attaches the avatar file when provided', async () => {
    let sentAvatar: File | null = null
    server.use(
      http.post(AUTH_ENDPOINTS.REGISTER, async ({ request }) => {
        const form = await request.formData()
        const avatar = form.get('avatar')
        sentAvatar = avatar instanceof File ? avatar : (avatar as unknown as File)
        return HttpResponse.json({ message: 'Registration successful.', user: createMockUser() }, { status: 201 })
      }),
    )

    const avatar = new File(['avatar-bytes'], 'me.png', { type: 'image/png' })
    await authApi.register({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'secret12',
      password_confirmation: 'secret12',
      avatar,
    })

    expect(sentAvatar).toBeInstanceOf(File)
    expect(sentAvatar?.name).toBe('me.png')
  })
})

describe('authApi.logout', () => {
  it('POSTs to the logout endpoint', async () => {
    server.use(
      http.post(AUTH_ENDPOINTS.LOGOUT, ({ request }) => {
        calls.push({ method: request.method, url: String(request.url), body: null })
        return HttpResponse.json({ message: 'Logged out successfully.' })
      }),
    )

    await authApi.logout()

    expect(calls).toHaveLength(1)
    expect(calls[0].method).toBe('POST')
    expect(calls[0].url).toContain('/api/v1/auth/logout')
  })
})

describe('authApi.getCurrentUser', () => {
  it('GETs the current user and returns the nested user object', async () => {
    server.use(
      http.get(AUTH_ENDPOINTS.ME, ({ request }) => {
        calls.push({ method: request.method, url: String(request.url), body: null })
        return HttpResponse.json({ user: createMockUser({ id: 3, name: 'Sam' }) })
      }),
    )

    const result = await authApi.getCurrentUser()

    expect(calls).toHaveLength(1)
    expect(calls[0].method).toBe('GET')
    expect(calls[0].url).toContain('/api/v1/auth/me')
    expect(result.user).toMatchObject({ id: 3, name: 'Sam' })
  })
})

describe('authApi.updateProfile', () => {
  it('POSTs multipart data with _method PUT to the profile endpoint', async () => {
    server.use(
      http.post(AUTH_ENDPOINTS.PROFILE, async ({ request }) => {
        const form = await request.formData()
        calls.push({
          method: request.method,
          url: String(request.url),
          body: { name: form.get('name'), email: form.get('email'), method: form.get('_method') },
        })
        return HttpResponse.json({ message: 'Profile updated.', user: createMockUser({ name: 'New Name' }) })
      }),
    )

    const result = await authApi.updateProfile({ name: 'New Name', email: 'new@example.com' })

    expect(calls).toHaveLength(1)
    expect(calls[0].method).toBe('POST')
    expect(calls[0].url).toContain('/api/v1/auth/profile')
    expect(calls[0].body).toEqual({
      name: 'New Name',
      email: 'new@example.com',
      method: 'PUT',
    })
    expect(result.user.name).toBe('New Name')
  })
})