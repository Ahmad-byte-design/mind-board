import { useCallback, useEffect } from 'react'
import type { Node, NodeMouseHandler } from '@xyflow/react'
import { useBoardStore } from '../../store/board.store'
import type { PaperFlowNode } from '../../types/reactflow.types'
import type { PaperInteractionState } from '../../types/board.types'

interface UseBoardInteractionsOptions {
  getNodes: () => Node[]
  setNodes: (updater: (nodes: Node[]) => Node[]) => void
  onDeletePaper: (paperId: number) => void
  onDeleteString: (stringId: number) => void
}

export function useBoardInteractions({
  getNodes,
  setNodes,
  onDeletePaper,
  onDeleteString,
}: UseBoardInteractionsOptions) {
  const selectedPaperId = useBoardStore((state) => state.selectedPaperId)
  const selectedStringId = useBoardStore((state) => state.selectedStringId)
  const movablePaperId = useBoardStore((state) => state.movablePaperId)
  const setSelectedPaper = useBoardStore((state) => state.setSelectedPaper)
  const setSelectedString = useBoardStore((state) => state.setSelectedString)
  const setMovablePaper = useBoardStore((state) => state.setMovablePaper)
  const setIsDetailsPanelOpen = useBoardStore((state) => state.setIsDetailsPanelOpen)
  const openContextMenu = useBoardStore((state) => state.openContextMenu)
  const closeContextMenu = useBoardStore((state) => state.closeContextMenu)

  useEffect(() => {
    const nodes = getNodes()
    if (nodes.length === 0) return
    const next = nodes.map((node) => {
      if (node.type !== 'paper') return node
      const paper = node as PaperFlowNode
      const id = paper.data.id
      let interactionState: PaperInteractionState = 'idle'
      if (paper.dragging) interactionState = 'dragging'
      else if (movablePaperId === id) interactionState = 'movable'
      else if (selectedPaperId === id) interactionState = 'selected'

      const draggable = movablePaperId === id

      if (paper.draggable === draggable && paper.data.interactionState === interactionState) {
        return paper
      }
      return {
        ...paper,
        draggable,
        data: { ...paper.data, interactionState },
      }
    })
    setNodes(() => next)
  }, [selectedPaperId, movablePaperId, getNodes, setNodes])

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const paperId = (node.data as { id?: number }).id
      if (paperId === undefined) return
      setSelectedPaper(paperId)
      setSelectedString(null)
      setMovablePaper(paperId)
      setIsDetailsPanelOpen(true)
      closeContextMenu()
    },
    [setSelectedPaper, setSelectedString, setMovablePaper, setIsDetailsPanelOpen, closeContextMenu],
  )

  const handleNodeDoubleClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const paperId = (node.data as { id?: number }).id
      if (paperId === undefined) return
      setMovablePaper(paperId)
    },
    [setMovablePaper],
  )

  const handleNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node) => {
      const paperId = (node.data as { id?: number }).id
      if (paperId === undefined) return
      event.preventDefault()
      setSelectedPaper(paperId)
      openContextMenu(paperId, event.clientX, event.clientY)
    },
    [setSelectedPaper, openContextMenu],
  )

  const handlePaneClick = useCallback(() => {
    closeContextMenu()
    setSelectedPaper(null)
    setSelectedString(null)
    setMovablePaper(null)
    setIsDetailsPanelOpen(false)
  }, [closeContextMenu, setSelectedPaper, setSelectedString, setMovablePaper, setIsDetailsPanelOpen])

  const deleteSelected = useCallback(() => {
    if (selectedPaperId !== null) {
      onDeletePaper(selectedPaperId)
      return
    }
    if (selectedStringId !== null) {
      onDeleteString(selectedStringId)
    }
  }, [selectedPaperId, selectedStringId, onDeletePaper, onDeleteString])

  const handleKeyboard = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      if (isTyping) return

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        deleteSelected()
      }
    },
    [deleteSelected],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [handleKeyboard])

  return {
    handleNodeClick,
    handleNodeDoubleClick,
    handleNodeContextMenu,
    handlePaneClick,
  }
}
