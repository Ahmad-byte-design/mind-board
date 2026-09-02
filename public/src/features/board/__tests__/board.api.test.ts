import { beforeEach, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { boardApi } from '../api/board.api'
import { BOARD_ENDPOINTS } from '../constants/board.constants'

const requests: { method: string; url: string; body: unknown }[] = []

beforeEach(() => {
  requests.length = 0
})

describe('boardApi.getBoard', () => {
  it('GETs the board and maps papers and strings to domain shapes', async () => {
    server.use(
      http.get(BOARD_ENDPOINTS.BOARD(':pageId' as unknown as number), ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: null })
        return HttpResponse.json({
          papers: [
            {
              id: 4,
              page_id: 2,
              content: 'Hooks',
              x: 12,
              y: 34,
              created_at: '2026-08-27T10:47:30.000000Z',
              updated_at: '2026-08-27T10:47:30.000000Z',
            },
          ],
          strings: [{ id: 8, paper1_id: 4, paper2_id: 5 }],
        })
      }),
    )

    const board = await boardApi.getBoard(2)

    expect(requests[0].method).toBe('GET')
    expect(requests[0].url).toContain('/api/v1/pages/2/board')
    expect(board.papers[0]).toEqual({
      id: 4,
      pageId: 2,
      content: 'Hooks',
      x: 12,
      y: 34,
      createdAt: '2026-08-27T10:47:30.000000Z',
      updatedAt: '2026-08-27T10:47:30.000000Z',
    })
    expect(board.strings[0]).toEqual({ id: 8, paper1Id: 4, paper2Id: 5 })
  })
})

describe('boardApi.savePositions', () => {
  it('PATCHes only the changed paper positions', async () => {
    server.use(
      http.patch(BOARD_ENDPOINTS.BOARD(':pageId' as unknown as number), async ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: await request.json() })
        return HttpResponse.json({ message: 'Board updated successfully.' })
      }),
    )

    await boardApi.savePositions(2, [
      { id: 4, x: 100, y: 200 },
      { id: 5, x: 300, y: 400 },
    ])

    expect(requests[0].method).toBe('PATCH')
    expect(requests[0].url).toContain('/api/v1/pages/2/board')
    expect(requests[0].body).toEqual({
      papers: [
        { id: 4, x: 100, y: 200 },
        { id: 5, x: 300, y: 400 },
      ],
    })
  })
})

describe('boardApi.createPaper', () => {
  it('POSTs the content and returns the mapped paper', async () => {
    server.use(
      http.post(BOARD_ENDPOINTS.PAPERS_CREATE(':pageId' as unknown as number), async ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: await request.json() })
        return HttpResponse.json(
          {
            message: 'Paper created successfully.',
            paper: {
              id: 11,
              page_id: 2,
              content: 'New idea',
              x: 0,
              y: 0,
              created_at: '2026-08-27T10:47:30.000000Z',
              updated_at: '2026-08-27T10:47:30.000000Z',
            },
          },
          { status: 201 },
        )
      }),
    )

    const paper = await boardApi.createPaper(2, { content: 'New idea' })

    expect(requests[0].method).toBe('POST')
    expect(requests[0].url).toContain('/api/v1/pages/2/papers')
    expect(requests[0].body).toEqual({ content: 'New idea' })
    expect(paper.id).toBe(11)
  })

  it('propagates API errors', async () => {
    server.use(
      http.post(BOARD_ENDPOINTS.PAPERS_CREATE(':pageId' as unknown as number), () =>
        HttpResponse.json({ message: 'Forbidden.' }, { status: 403 }),
      ),
    )

    await expect(boardApi.createPaper(2, { content: 'x' })).rejects.toMatchObject({ response: { status: 403 } })
  })
})

describe('boardApi.updatePaper', () => {
  it('PUTs the paper content and returns the updated paper', async () => {
    server.use(
      http.put(BOARD_ENDPOINTS.PAPER_UPDATE(':id' as unknown as number), async ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: await request.json() })
        return HttpResponse.json({
          message: 'Paper updated successfully.',
          paper: {
            id: 4,
            page_id: 2,
            content: 'Edited content',
            x: 12,
            y: 34,
            created_at: '2026-08-27T10:47:30.000000Z',
            updated_at: '2026-08-27T10:47:30.000000Z',
          },
        })
      }),
    )

    const paper = await boardApi.updatePaper(4, { content: 'Edited content' })

    expect(requests[0].method).toBe('PUT')
    expect(requests[0].url).toContain('/api/v1/papers/4')
    expect(requests[0].body).toEqual({ content: 'Edited content' })
    expect(paper.content).toBe('Edited content')
  })
})

describe('boardApi.deletePaper', () => {
  it('DELETEs the paper endpoint', async () => {
    server.use(
      http.delete(BOARD_ENDPOINTS.PAPER_DELETE(':id' as unknown as number), ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: null })
        return HttpResponse.json({ message: 'Paper deleted successfully.' })
      }),
    )

    await boardApi.deletePaper(4)

    expect(requests[0].method).toBe('DELETE')
    expect(requests[0].url).toContain('/api/v1/papers/4')
  })
})

describe('boardApi.createString', () => {
  it('POSTs snake_case paper ids and maps the created string', async () => {
    server.use(
      http.post(BOARD_ENDPOINTS.STRINGS_CREATE(':pageId' as unknown as number), async ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: await request.json() })
        return HttpResponse.json(
          {
            message: 'String created successfully.',
            string: { id: 21, paper1_id: 4, paper2_id: 5 },
          },
          { status: 201 },
        )
      }),
    )

    const string = await boardApi.createString(2, { paper1Id: 4, paper2Id: 5 })

    expect(requests[0].method).toBe('POST')
    expect(requests[0].url).toContain('/api/v1/pages/2/strings')
    expect(requests[0].body).toEqual({ paper1_id: 4, paper2_id: 5 })
    expect(string).toEqual({ id: 21, paper1Id: 4, paper2Id: 5 })
  })
})

describe('boardApi.deleteString', () => {
  it('DELETEs the string endpoint', async () => {
    server.use(
      http.delete(BOARD_ENDPOINTS.STRING_DELETE(':id' as unknown as number), ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: null })
        return HttpResponse.json({ message: 'String deleted successfully.' })
      }),
    )

    await boardApi.deleteString(21)

    expect(requests[0].method).toBe('DELETE')
    expect(requests[0].url).toContain('/api/v1/strings/21')
  })
})

describe('boardApi.generateBoard', () => {
  it('POSTs to the generate endpoint and maps the generated board', async () => {
    server.use(
      http.post(BOARD_ENDPOINTS.BOARD_GENERATE(':pageId' as unknown as number), ({ request }) => {
        requests.push({ method: request.method, url: String(request.url), body: null })
        return HttpResponse.json({
          message: 'Board generated successfully.',
          papers: [
            {
              id: 1,
              page_id: 2,
              content: 'JavaScript Fundamentals',
              x: 0,
              y: 0,
              created_at: '2026-08-27T10:47:30.000000Z',
              updated_at: '2026-08-27T10:47:30.000000Z',
            },
            {
              id: 2,
              page_id: 2,
              content: 'React Components',
              x: 150,
              y: 0,
              created_at: '2026-08-27T10:47:30.000000Z',
              updated_at: '2026-08-27T10:47:30.000000Z',
            },
          ],
          strings: [{ id: 1, paper1_id: 1, paper2_id: 2 }],
        })
      }),
    )

    const board = await boardApi.generateBoard(2)

    expect(requests[0].method).toBe('POST')
    expect(requests[0].url).toContain('/api/v1/pages/2/generate')
    expect(board.papers).toHaveLength(2)
    expect(board.papers[0].content).toBe('JavaScript Fundamentals')
    expect(board.strings[0]).toEqual({ id: 1, paper1Id: 1, paper2Id: 2 })
  })
})