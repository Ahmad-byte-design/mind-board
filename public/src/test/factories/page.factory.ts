import type { Page } from '@/features/pages/types/page.types'

export function createMockPage(overrides: Partial<Page> = {}): Page {
  return {
    id: 1,
    title: 'React Mastery',
    status: 'active',
    progress: 50,
    conceptsCount: 5,
    createdAt: '2026-08-27T10:47:30.000000Z',
    updatedAt: '2026-08-27T10:47:30.000000Z',
    ...overrides,
  }
}