import { beforeEach, describe, expect, it } from 'vitest'
import { useBoardStore } from '../store/board.store'

describe('useBoardStore', () => {
  beforeEach(() => {
    useBoardStore.setState({
      selectedPaperId: null,
      movablePaperId: null,
      selectedStringId: null,
      isDetailsPanelOpen: false,
      contextMenu: null,
    })
  })

  it('starts with an empty board selection state', () => {
    const state = useBoardStore.getState()
    expect(state.selectedPaperId).toBeNull()
    expect(state.movablePaperId).toBeNull()
    expect(state.selectedStringId).toBeNull()
    expect(state.isDetailsPanelOpen).toBe(false)
    expect(state.contextMenu).toBeNull()
  })

  it('selects a paper by id', () => {
    useBoardStore.getState().setSelectedPaper(12)
    expect(useBoardStore.getState().selectedPaperId).toBe(12)
  })

  it('clears the paper selection with null', () => {
    useBoardStore.getState().setSelectedPaper(12)
    useBoardStore.getState().setSelectedPaper(null)
    expect(useBoardStore.getState().selectedPaperId).toBeNull()
  })

  it('marks a paper as movable', () => {
    useBoardStore.getState().setMovablePaper(7)
    expect(useBoardStore.getState().movablePaperId).toBe(7)
  })

  it('releases the movable paper', () => {
    useBoardStore.getState().setMovablePaper(7)
    useBoardStore.getState().setMovablePaper(null)
    expect(useBoardStore.getState().movablePaperId).toBeNull()
  })

  it('selects a string by id', () => {
    useBoardStore.getState().setSelectedString(3)
    expect(useBoardStore.getState().selectedStringId).toBe(3)
  })

  it('opens and closes the details panel', () => {
    useBoardStore.getState().setIsDetailsPanelOpen(true)
    expect(useBoardStore.getState().isDetailsPanelOpen).toBe(true)
    useBoardStore.getState().setIsDetailsPanelOpen(false)
    expect(useBoardStore.getState().isDetailsPanelOpen).toBe(false)
  })

  it('opens the context menu with coordinates', () => {
    useBoardStore.getState().openContextMenu(5, 100, 200)
    expect(useBoardStore.getState().contextMenu).toEqual({ paperId: 5, x: 100, y: 200 })
  })

  it('closes the context menu', () => {
    useBoardStore.getState().openContextMenu(5, 100, 200)
    useBoardStore.getState().closeContextMenu()
    expect(useBoardStore.getState().contextMenu).toBeNull()
  })
})