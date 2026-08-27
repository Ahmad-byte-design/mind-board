import api from '@/lib/axios'
import { PAGE_ENDPOINTS, PAGE_QUERY_LIMIT } from '../constants/pages.constants'
import type {
  CreatePageInput,
  CursorPaginated,
  Page,
  UpdatePageInput,
  PageStatus,
} from '../types/page.types'

interface RawPage {
  id: number
  title: string
  status?: PageStatus
  progress?: number
  concepts_count?: number
  created_at: string
  updated_at: string
}

interface RawSinglePageResponse {
  message: string
  page: RawPage
}

function mapPage(raw: RawPage): Page {
  return {
    id: raw.id,
    title: raw.title,
    status: raw.status,
    progress: typeof raw.progress === 'number' ? raw.progress : undefined,
    conceptsCount: typeof raw.concepts_count === 'number' ? raw.concepts_count : undefined,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

export const pagesApi = {
  list: async (cursor: string | null, perPage: number = PAGE_QUERY_LIMIT): Promise<CursorPaginated<Page>> => {
    const response = await api.get<CursorPaginated<RawPage>>(PAGE_ENDPOINTS.LIST, {
      params: { cursor, per_page: perPage },
    })
    return {
      data: response.data.data.map(mapPage),
      meta: response.data.meta,
    }
  },

  get: async (id: number): Promise<Page> => {
    const response = await api.get<{ page: RawPage }>(PAGE_ENDPOINTS.SHOW(id))
    return mapPage(response.data.page)
  },

  create: async (input: CreatePageInput): Promise<Page> => {
    const response = await api.post<RawSinglePageResponse>(PAGE_ENDPOINTS.CREATE, input)
    return mapPage(response.data.page)
  },

  update: async (id: number, input: UpdatePageInput): Promise<Page> => {
    const response = await api.put<RawSinglePageResponse>(PAGE_ENDPOINTS.UPDATE(id), input)
    return mapPage(response.data.page)
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(PAGE_ENDPOINTS.DELETE(id))
  },
}