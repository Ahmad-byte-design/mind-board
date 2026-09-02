import { http, HttpResponse } from 'msw'
import { createMockPaper } from '@/test/factories'

// Request handlers use MSW route parameters (`:pageId`, `:id`) that are
// strings. The endpoint helpers accept numbers, so we build the same paths
// literally here; they mirror BOARD_ENDPOINTS at runtime.
const BOARD_PATH = '/api/v1/pages/:pageId/board'
const PAPERS_CREATE_PATH = '/api/v1/pages/:pageId/papers'
const PAPER_PATH = '/api/v1/papers/:id'
const STRINGS_CREATE_PATH = '/api/v1/pages/:pageId/strings'
const STRING_PATH = '/api/v1/strings/:id'
const BOARD_GENERATE_PATH = '/api/v1/pages/:pageId/generate'

export const boardHandlers = [
  http.get(BOARD_PATH, () =>
    HttpResponse.json({
      papers: [{ ...paperOf(createMockPaper()), id: 1, content: 'React Fundamentals', x: 10, y: 20 }],
      strings: [],
    }),
  ),

  http.patch(BOARD_PATH, async ({ request }) => {
    const body = (await request.json()) as {
      papers?: { id: number; x: number; y: number }[]
      strings?: { paper1_id: number; paper2_id: number }[]
    }
    return HttpResponse.json({
      message: 'Board updated successfully.',
      created_strings: [],
      saved_papers: body.papers?.length ?? 0,
    })
  }),

  http.post(PAPERS_CREATE_PATH, async ({ request }) => {
    const body = (await request.json()) as { content?: string }
    return HttpResponse.json(
      {
        message: 'Paper created successfully.',
        paper: rawPaper({ id: 5, content: body.content ?? '' }),
      },
      { status: 201 },
    )
  }),

  http.put(PAPER_PATH, async ({ request }) => {
    const body = (await request.json()) as { content?: string }
    return HttpResponse.json({
      message: 'Paper updated successfully.',
      paper: rawPaper({ id: 1, content: body.content ?? '' }),
    })
  }),

  http.delete(PAPER_PATH, () =>
    HttpResponse.json({ message: 'Paper deleted successfully.' }),
  ),

  http.post(STRINGS_CREATE_PATH, async ({ request }) => {
    const body = (await request.json()) as { paper1_id?: number; paper2_id?: number }
    return HttpResponse.json(
      {
        message: 'String created successfully.',
        string: rawString({ id: 10, paper1_id: body.paper1_id ?? 1, paper2_id: body.paper2_id ?? 2 }),
      },
      { status: 201 },
    )
  }),

  http.delete(STRING_PATH, () =>
    HttpResponse.json({ message: 'String deleted successfully.' }),
  ),

  http.post(BOARD_GENERATE_PATH, () =>
    HttpResponse.json({
      message: 'Board generated successfully.',
      papers: [
        rawPaper({ id: 1, content: 'JavaScript Fundamentals' }),
        rawPaper({ id: 2, content: 'React Components', x: 150, y: 0 }),
      ],
      strings: [rawString({ id: 1, paper1_id: 1, paper2_id: 2 })],
    }),
  ),
]

function paperOf(paper: ReturnType<typeof createMockPaper>): RawPaper {
  return {
    id: paper.id,
    page_id: paper.pageId,
    content: paper.content,
    x: paper.x,
    y: paper.y,
    created_at: paper.createdAt,
    updated_at: paper.updatedAt,
  }
}

interface RawPaper {
  id: number
  page_id: number
  content: string
  x: number
  y: number
  created_at: string
  updated_at: string
}

function rawPaper(overrides: Partial<RawPaper> = {}): RawPaper {
  return {
    id: 1,
    page_id: 1,
    content: 'React Fundamentals',
    x: 0,
    y: 0,
    created_at: '2026-08-27T10:47:30.000000Z',
    updated_at: '2026-08-27T10:47:30.000000Z',
    ...overrides,
  }
}

function rawString(overrides: Partial<RawString> = {}): RawString {
  return { id: 1, paper1_id: 1, paper2_id: 2, ...overrides }
}

interface RawString {
  id: number
  paper1_id: number
  paper2_id: number
}