import type { User } from '@/features/auth/types/auth.types'

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
    createdAt: '2026-08-26T15:12:12.000000Z',
    ...overrides,
  }
}