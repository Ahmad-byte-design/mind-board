export const PAGE_ENDPOINTS = {
  LIST: '/api/v1/pages',
  CREATE: '/api/v1/pages',
  SHOW: (id: number) => `/api/v1/pages/${id}`,
  UPDATE: (id: number) => `/api/v1/pages/${id}`,
  DELETE: (id: number) => `/api/v1/pages/${id}`,
} as const

export const PAGE_QUERY_LIMIT = 15

export const SIDEBAR_WIDTH_KEY = 'mindboard:sidebar-width'
export const SIDEBAR_COLLAPSED_KEY = 'mindboard:sidebar-collapsed'
export const SIDEBAR_DEFAULT_WIDTH = 320
export const SIDEBAR_MIN_WIDTH = 240
export const SIDEBAR_MAX_WIDTH = 450
export const SIDEBAR_RAIL_WIDTH = 72
export const MOBILE_BREAKPOINT = '(max-width: 767px)'