import type { PaperString } from '@/features/board/types/board.types'

export function createMockString(overrides: Partial<PaperString> = {}): PaperString {
  return {
    id: 1,
    paper1Id: 1,
    paper2Id: 2,
    ...overrides,
  }
}