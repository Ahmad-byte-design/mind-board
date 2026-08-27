export type PageStatus = 'active' | 'archived'

export interface Page {
  id: number
  title: string
  status?: PageStatus
  progress?: number
  conceptsCount?: number
  createdAt: string
  updatedAt: string
}

export interface CursorMeta {
  perPage: number
  nextCursor: string | null
  prevCursor: string | null
}

export interface CursorPaginated<T> {
  data: T[]
  meta: CursorMeta
}

export interface SinglePageResponse {
  message: string
  page: Page
}

export interface CreatePageInput {
  title: string
}

export interface UpdatePageInput {
  title: string
}