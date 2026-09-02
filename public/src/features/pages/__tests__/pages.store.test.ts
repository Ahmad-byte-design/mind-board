import { beforeEach, describe, expect, it } from 'vitest'
import { usePagesStore } from '../store/pages.store'

describe('usePagesStore', () => {
  beforeEach(() => {
    usePagesStore.setState({ selectedPageId: null, isMobileSidebarOpen: false })
  })

  it('starts with no selected page and the sidebar closed', () => {
    expect(usePagesStore.getState().selectedPageId).toBeNull()
    expect(usePagesStore.getState().isMobileSidebarOpen).toBe(false)
  })

  it('selects a page by id', () => {
    usePagesStore.getState().setSelectedPageId(42)
    expect(usePagesStore.getState().selectedPageId).toBe(42)
  })

  it('clears the selected page', () => {
    usePagesStore.getState().setSelectedPageId(42)
    usePagesStore.getState().setSelectedPageId(null)
    expect(usePagesStore.getState().selectedPageId).toBeNull()
  })

  it('opens and closes the mobile sidebar', () => {
    usePagesStore.getState().setMobileSidebarOpen(true)
    expect(usePagesStore.getState().isMobileSidebarOpen).toBe(true)
    usePagesStore.getState().setMobileSidebarOpen(false)
    expect(usePagesStore.getState().isMobileSidebarOpen).toBe(false)
  })
})