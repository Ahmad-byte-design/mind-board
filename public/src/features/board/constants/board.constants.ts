export const BOARD_ENDPOINTS = {
  BOARD: (pageId: number) => `/api/v1/pages/${pageId}/board`,
  PAPERS_CREATE: (pageId: number) => `/api/v1/pages/${pageId}/papers`,
  PAPER_SHOW: (id: number) => `/api/v1/papers/${id}`,
  PAPER_UPDATE: (id: number) => `/api/v1/papers/${id}`,
  PAPER_DELETE: (id: number) => `/api/v1/papers/${id}`,
  STRINGS_CREATE: (pageId: number) => `/api/v1/pages/${pageId}/strings`,
  STRING_DELETE: (id: number) => `/api/v1/strings/${id}`,
  BOARD_GENERATE: (pageId: number) => `/api/v1/pages/${pageId}/generate`,
} as const

export const RED_STRING_STROKE = '#C0392B'
export const RED_STRING_STROKE_WIDTH = 2

export const BOARD_SAVE_DEBOUNCE_MS = 5000
