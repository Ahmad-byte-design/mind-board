import type { User, AuthResponse } from '@/features/auth/types/auth.types'
import { createMockUser } from './user.factory'
import type { BoardData } from '@/features/board/api/board.api'
import { createMockPaper } from './paper.factory'
import { createMockString } from './string.factory'

export function createMockAuthResponse(
  overrides: Partial<
    Omit<AuthResponse, 'user'> & { user: Partial<User> }
  > = {},
): AuthResponse {
  const { user, ...rest } = overrides
  return {
    message: 'Login successful.',
    user: createMockUser(user ?? {}),
    ...rest,
  }
}

export function createMockBoard(overrides: Partial<BoardData> = {}): BoardData {
  return {
    papers: [createMockPaper()],
    strings: [createMockString()],
    ...overrides,
  }
}