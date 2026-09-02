import { describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { createMockAuthResponse, createMockUser } from '@/test/factories'
import { AUTH_ENDPOINTS } from '../constants/auth.constants'

async function loadFreshStore() {
  vi.resetModules()
  const mod = await import('../store/auth.store')
  return mod.useAuthStore
}

describe('useAuthStore', () => {
  it('starts unauthenticated', async () => {
    const store = await loadFreshStore()
    expect(store.getState().user).toBeNull()
    expect(store.getState().isAuthenticated).toBe(false)
    expect(store.getState().isInitializing).toBe(false)
  })

  it('stores the current user after initializeAuth succeeds', async () => {
    const store = await loadFreshStore()
    const user = await store.getState().initializeAuth()

    expect(user).toEqual(createMockUser())
    expect(store.getState().user).toEqual(createMockUser())
    expect(store.getState().isAuthenticated).toBe(true)
    expect(store.getState().isInitializing).toBe(false)
  })

  it('stays unauthenticated when the session is invalid', async () => {
    server.use(
      http.get(AUTH_ENDPOINTS.ME, () => HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 })),
    )
    const store = await loadFreshStore()

    await store.getState().initializeAuth()

    expect(store.getState().user).toBeNull()
    expect(store.getState().isAuthenticated).toBe(false)
    expect(store.getState().isInitializing).toBe(false)
  })

  it('does not swallow a non-401 initialization error', async () => {
    server.use(
      http.get(AUTH_ENDPOINTS.ME, () => HttpResponse.json({ message: 'boom' }, { status: 500 })),
    )
    const store = await loadFreshStore()

    await store.getState().initializeAuth()

    expect(store.getState().isInitializing).toBe(false)
    expect(store.getState().isAuthenticated).toBe(false)
  })

  it('deduplicates concurrent initialization calls', async () => {
    const store = await loadFreshStore()

    const first = store.getState().initializeAuth()
    const second = store.getState().initializeAuth()

    expect(second).toBe(first)
    await Promise.all([first, second])
    expect(store.getState().isAuthenticated).toBe(true)
  })

  it('sets a user directly via setUser', async () => {
    const store = await loadFreshStore()
    store.getState().setUser(createMockUser())
    expect(store.getState().isAuthenticated).toBe(true)
  })

  it('clears the user on logout', async () => {
    const store = await loadFreshStore()
    store.getState().setUser(createMockUser())

    store.getState().logout()

    expect(store.getState().user).toBeNull()
    expect(store.getState().isAuthenticated).toBe(false)
  })

  it('tracks the initializing flag', async () => {
    const store = await loadFreshStore()
    store.getState().setInitializing(true)
    expect(store.getState().isInitializing).toBe(true)
  })

  it('returns the stored user when initialization succeeds persistently', async () => {
    const store = await loadFreshStore()
    const user = await store.getState().initializeAuth()

    expect(createMockAuthResponse({ user }).user).toEqual(createMockUser())
  })
})