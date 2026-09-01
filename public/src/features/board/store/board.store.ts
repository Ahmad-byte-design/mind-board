import { create } from 'zustand'

interface BoardUiState {
  selectedPaperId: number | null
  movablePaperId: number | null
  selectedStringId: number | null
  isDetailsPanelOpen: boolean
  contextMenu: { paperId: number; x: number; y: number } | null

  setSelectedPaper: (id: number | null) => void
  setMovablePaper: (id: number | null) => void
  setSelectedString: (id: number | null) => void
  setIsDetailsPanelOpen: (open: boolean) => void
  openContextMenu: (paperId: number, x: number, y: number) => void
  closeContextMenu: () => void
}

export const useBoardStore = create<BoardUiState>((set) => ({
  selectedPaperId: null,
  movablePaperId: null,
  selectedStringId: null,
  isDetailsPanelOpen: false,
  contextMenu: null,

  setSelectedPaper: (selectedPaperId) => set({ selectedPaperId }),
  setMovablePaper: (movablePaperId) => set({ movablePaperId }),
  setSelectedString: (selectedStringId) => set({ selectedStringId }),
  setIsDetailsPanelOpen: (isDetailsPanelOpen) => set({ isDetailsPanelOpen }),
  openContextMenu: (paperId, x, y) => set({ contextMenu: { paperId, x, y } }),
  closeContextMenu: () => set({ contextMenu: null }),
}))
