export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'] as const,
  },
  PAGES: {
    LIST: ['pages'] as const,
    ONE: (id: number) => ['pages', id] as const,
  },
  PAPERS: {
    LIST: ['papers'] as const,
    ONE: (id: number) => ['papers', id] as const,
  },
  STRINGS: {
    LIST: ['strings'] as const,
  },
  AI: {
    GENERATE: ['ai', 'generate'] as const,
  },
  LEARNING: {
    PROGRESS: ['learning', 'progress'] as const,
  },
} as const
