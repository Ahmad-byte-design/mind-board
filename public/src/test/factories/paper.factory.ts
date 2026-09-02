import type { Paper } from '@/features/board/types/board.types'

export function createMockPaper(overrides: Partial<Paper> = {}): Paper {
  return {
    id: 1,
    pageId: 1,
    content: 'React Fundamentals',
    x: 10,
    y: 20,
    createdAt: '2026-08-27T10:47:30.000000Z',
    updatedAt: '2026-08-27T10:47:30.000000Z',
    ...overrides,
  }
}