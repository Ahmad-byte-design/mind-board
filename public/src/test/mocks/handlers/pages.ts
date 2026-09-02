import { http, HttpResponse } from 'msw'
import { createMockPage } from '@/test/factories'

// MSW route parameters (`:id`) are strings, so these paths are written
// literally; they mirror PAGE_ENDPOINTS at runtime.
const LIST_PATH = '/api/v1/pages'
const PAGE_PATH = '/api/v1/pages/:id'

interface RawPage {
  id: number
  title: string
  status?: string
  progress?: number
  concepts_count?: number
  created_at: string
  updated_at: string
}

function toRawPage(page: {
  id: number
  title: string
  status?: string
  progress?: number
  conceptsCount?: number
  createdAt: string
  updatedAt: string
}): RawPage {
  return {
    id: page.id,
    title: page.title,
    status: page.status,
    progress: page.progress,
    concepts_count: page.conceptsCount,
    created_at: page.createdAt,
    updated_at: page.updatedAt,
  }
}

export const pagesHandlers = [
  http.get(LIST_PATH, ({ request }) => {
    const url = new URL(request.url)
    const cursor = url.searchParams.get('cursor')

    const all = [
      createMockPage({ id: 1, title: 'React Mastery' }),
      createMockPage({ id: 2, title: 'TypeScript Depth' }),
      createMockPage({ id: 3, title: 'System Design' }),
    ]

    let data: (typeof all)[number][] = all
    let nextCursor: string | null = null
    let prevCursor: string | null = null

    if (cursor === null) {
      data = all.slice(0, 2)
      nextCursor = 'cursor-2'
    } else if (cursor === 'cursor-2') {
      data = all.slice(2)
      prevCursor = 'cursor-1'
    }

    return HttpResponse.json({ data: data.map(toRawPage), meta: { perPage: 15, nextCursor, prevCursor } })
  }),

  http.post(LIST_PATH, async ({ request }) => {
    const body = (await request.json()) as { title?: string }
    return HttpResponse.json(
      {
        message: 'Page created successfully.',
        page: toRawPage(createMockPage({ id: 99, title: body.title ?? '' })),
      },
      { status: 201 },
    )
  }),

  http.get(PAGE_PATH, () =>
    HttpResponse.json({ page: toRawPage(createMockPage({ id: 1 })) }),
  ),

  http.put(PAGE_PATH, async ({ request }) => {
    const body = (await request.json()) as { title?: string }
    return HttpResponse.json({
      message: 'Page updated successfully.',
      page: toRawPage(createMockPage({ id: 1, title: body.title ?? '' })),
    })
  }),

  http.delete(PAGE_PATH, () =>
    HttpResponse.json({ message: 'Page deleted successfully.' }),
  ),
]