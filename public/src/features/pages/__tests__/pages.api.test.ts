import { beforeEach, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { pagesApi } from '../api/pages.api'
import { PAGE_ENDPOINTS, PAGE_QUERY_LIMIT } from '../constants/pages.constants'
import type { CreatePageInput } from '../types/page.types'

const requests: { method: string; url: string; body: unknown }[] = []

function rawPage(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 1,
    title: 'React Mastery',
    created_at: '2026-08-27T10:47:30.000000Z',
    updated_at: '2026-08-27T10:47:30.000000Z',
    ...overrides,
  }
}

beforeEach(() => {
  requests.length = 0
})

describe('pagesApi.list', () => {
  it('GETs pages with cursor and per_page query parameters', async () => {
    server.use(
      http.get(PAGE_ENDPOINTS.LIST, ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: null })
        return HttpResponse.json({ data: [], meta: { perPage: PAGE_QUERY_LIMIT, nextCursor: null, prevCursor: null } })
      }),
    )

    const result = await pagesApi.list('abc-123')

    expect(requests).toHaveLength(1)
    expect(requests[0].method).toBe('GET')
    const url = new URL(requests[0].url)
    expect(url.pathname).toBe('/api/v1/pages')
    expect(url.searchParams.get('cursor')).toBe('abc-123')
    expect(url.searchParams.get('per_page')).toBe(String(PAGE_QUERY_LIMIT))
    expect(result.meta.nextCursor).toBeNull()
  })

  it('uses a null cursor for the first page', async () => {
    server.use(
      http.get(PAGE_ENDPOINTS.LIST, ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: null })
        return HttpResponse.json({ data: [], meta: { perPage: 15, nextCursor: null, prevCursor: null } })
      }),
    )

    await pagesApi.list(null)

    const url = new URL(requests[0].url)
    expect(url.searchParams.get('cursor')).toBeNull()
  })

  it('maps snake_case raw pages into camelCase domain pages', async () => {
    server.use(
      http.get(PAGE_ENDPOINTS.LIST, () =>
        HttpResponse.json({
          data: [
            rawPage({ id: 2, concepts_count: 7, progress: 60, status: 'active' }),
            rawPage({ id: 3 }),
          ],
          meta: { perPage: 15, nextCursor: 'next', prevCursor: null },
        }),
      ),
    )

    const result = await pagesApi.list(null)

    expect(result.data[0]).toEqual({
      id: 2,
      title: 'React Mastery',
      status: 'active',
      progress: 60,
      conceptsCount: 7,
      createdAt: '2026-08-27T10:47:30.000000Z',
      updatedAt: '2026-08-27T10:47:30.000000Z',
    })
    expect(result.data[1].progress).toBeUndefined()
    expect(result.meta.nextCursor).toBe('next')
  })
})

describe('pagesApi.get', () => {
  it('GETs a single page and unwraps it', async () => {
    server.use(
      http.get(PAGE_ENDPOINTS.SHOW(':id'), ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: null })
        return HttpResponse.json({ page: rawPage({ id: 5 }) })
      }),
    )

    const page = await pagesApi.get(5)

    expect(requests[0].method).toBe('GET')
    expect(requests[0].url).toContain('/api/v1/pages/5')
    expect(page.id).toBe(5)
  })
})

describe('pagesApi.create', () => {
  it('POSTs the title to the pages endpoint and returns the created page', async () => {
    const input: CreatePageInput = { title: 'New Topic' }
    server.use(
      http.post(PAGE_ENDPOINTS.CREATE, async ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: await request.json() })
        return HttpResponse.json({ message: 'Page created successfully.', page: rawPage({ id: 9, title: 'New Topic' }) }, { status: 201 })
      }),
    )

    const page = await pagesApi.create(input)

    expect(requests[0].method).toBe('POST')
    expect(requests[0].url).toContain('/api/v1/pages')
    expect(requests[0].body).toEqual({ title: 'New Topic' })
    expect(page).toMatchObject({ id: 9, title: 'New Topic' })
  })
})

describe('pagesApi.update', () => {
  it('PUTs the title to the page endpoint and returns the updated page', async () => {
    server.use(
      http.put(PAGE_ENDPOINTS.UPDATE(':id'), async ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: await request.json() })
        return HttpResponse.json({ message: 'Page updated successfully.', page: rawPage({ id: 1, title: 'Edited' }) })
      }),
    )

    const page = await pagesApi.update(1, { title: 'Edited' })

    expect(requests[0].method).toBe('PUT')
    expect(requests[0].url).toContain('/api/v1/pages/1')
    expect(requests[0].body).toEqual({ title: 'Edited' })
    expect(page.title).toBe('Edited')
  })
})

describe('pagesApi.delete', () => {
  it('DELETEs the page endpoint', async () => {
    server.use(
      http.delete(PAGE_ENDPOINTS.DELETE(':id'), ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: null })
        return HttpResponse.json({ message: 'Page deleted successfully.' })
      }),
    )

    await pagesApi.delete(7)

    expect(requests[0].method).toBe('DELETE')
    expect(requests[0].url).toContain('/api/v1/pages/7')
  })
})