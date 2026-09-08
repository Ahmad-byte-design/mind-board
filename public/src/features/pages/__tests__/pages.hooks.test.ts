import { describe, expect, it, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { renderHookWithProviders } from '@/test/test-utils'
import { usePages } from '../hooks/api/usePages'
import { useCreatePage } from '../hooks/api/useCreatePage'
import { useUpdatePage } from '../hooks/api/useUpdatePage'
import { useDeletePage } from '../hooks/api/useDeletePage'
import { usePagesStore } from '../store/pages.store'
import { PAGE_ENDPOINTS } from '../constants/pages.constants'

beforeEach(() => {
  usePagesStore.setState({ selectedPageId: null, isMobileSidebarOpen: false })
})

describe('usePages', () => {
  it('loads the first cursor page', async () => {
    const { result } = renderHookWithProviders(() => usePages())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const pages = result.current.data?.pages.flatMap((group) => group.data) ?? []
    expect(pages.map((p) => p.id)).toEqual([1, 2])
    expect(result.current.hasNextPage).toBe(true)
  })

  it('appends the next cursor page and keeps previous pages', async () => {
    const { result } = renderHookWithProviders(() => usePages())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    await result.current.fetchNextPage()
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2))

    const pages = result.current.data?.pages.flatMap((group) => group.data) ?? []
    expect(pages.map((p) => p.id)).toEqual([1, 2, 3])
    expect(pages).toHaveLength(3)
    expect(result.current.hasNextPage).toBe(false)
  })

  it('does not duplicate pages across fetches', async () => {
    const { result } = renderHookWithProviders(() => usePages())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    await result.current.fetchNextPage()
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2))

    const pages = result.current.data?.pages.flatMap((group) => group.data) ?? []
    const ids = pages.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('reports an error state when the request fails', async () => {
    server.use(
      http.get(PAGE_ENDPOINTS.LIST, () => HttpResponse.json({ message: 'Server error' }, { status: 500 })),
    )

    const { result } = renderHookWithProviders(() => usePages())

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useCreatePage', () => {
  it('creates a page, prepends it to the list cache and selects it', async () => {
    const { result, queryClient } = renderHookWithProviders(() => {
      const createPage = useCreatePage()
      const pages = usePages()
      return { createPage, pages }
    })

    // seed the list with a first page so onSuccess has something to update
    await waitFor(() => expect(result.current.pages.isSuccess).toBe(true))
    const initialCount = result.current.pages.data!.pages[0].data.length

    result.current.createPage.mutate({ title: 'Brand New Topic' })

    await waitFor(() => expect(result.current.createPage.isSuccess).toBe(true))

    const firstPage = queryClient.getQueryData<{ pages: { data: { title: string }[] }[] }>(['pages'])
    const titles = firstPage!.pages[0].data.map((p) => p.title)
    expect(titles[0]).toBe('Brand New Topic')
    expect(titles).toHaveLength(initialCount + 1)
    expect(usePagesStore.getState().selectedPageId).toBe(99)
  })
})

describe('useUpdatePage', () => {
  it('replaces the updated page in the list cache', async () => {
    const { result, queryClient } = renderHookWithProviders(() => {
      const updatePage = useUpdatePage()
      const pages = usePages()
      return { updatePage, pages }
    })

    await waitFor(() => expect(result.current.pages.isSuccess).toBe(true))

    result.current.updatePage.mutate({ id: 2, title: 'Renamed Page' })

    await waitFor(() => expect(result.current.updatePage.isSuccess).toBe(true))

    const cache = queryClient.getQueryData<{ pages: { data: { id: number; title: string }[] }[] }>(['pages'])
    const updated = cache!.pages.flatMap((g) => g.data).find((p) => p.id === 2)
    expect(updated?.title).toBe('Renamed Page')
  })
})

describe('useDeletePage', () => {
  it('clears the selection when the selected page is deleted', async () => {
    const { result, queryClient } = renderHookWithProviders(() => {
      const deletePage = useDeletePage()
      const pages = usePages()
      return { deletePage, pages }
    })

    await waitFor(() => expect(result.current.pages.isSuccess).toBe(true))
    usePagesStore.getState().setSelectedPageId(1)

    result.current.deletePage.mutate(1)

    await waitFor(() => expect(result.current.deletePage.isSuccess).toBe(true))
    expect(usePagesStore.getState().selectedPageId).toBeNull()
    await waitFor(() =>
      expect(queryClient.getQueryState(['pages'])?.isInvalidated ?? true).toBe(true),
    )
  })
})