import { create } from 'zustand'

interface PagesState {
  selectedPageId: number | null
  setSelectedPageId: (id: number | null) => void
  isMobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
}

export const usePagesStore = create<PagesState>((set) => ({
  selectedPageId: null,
  setSelectedPageId: (selectedPageId) => set({ selectedPageId }),
  isMobileSidebarOpen: false,
  setMobileSidebarOpen: (isMobileSidebarOpen) => set({ isMobileSidebarOpen }),
}))