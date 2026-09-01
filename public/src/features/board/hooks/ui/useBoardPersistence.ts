import { useCallback, useEffect, useRef } from 'react'
import type { Node } from '@xyflow/react'
import { BOARD_SAVE_DEBOUNCE_MS } from '../../constants/board.constants'
import { useBoardStore } from '../../store/board.store'
import { useSaveBoard } from '../api/useSaveBoard'

export function useBoardPersistence(pageId: number | null, getNodes: () => Node[]) {
  const { save, retry, status, error } = useSaveBoard(pageId)
  const dirtyIdsRef = useRef<Set<number>>(new Set())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const setMovablePaper = useBoardStore((state) => state.setMovablePaper)

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (dirtyIdsRef.current.size === 0) return

    const allNodes = getNodes()
    const changed = allNodes.filter((node) => dirtyIdsRef.current.has(Number(node.id)))
    dirtyIdsRef.current = new Set()

    if (changed.length > 0) {
      void save(changed)
    }
  }, [getNodes, save])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const onNodeDragStart = useCallback(() => {
    // no-op: keep the activated paper draggable through the entire drag
  }, [])

  const onNodeDrag = useCallback((_e: unknown, node: Node) => {
    dirtyIdsRef.current.add(Number(node.id))
  }, [])

  const onNodeDragStop = useCallback(() => {
    setMovablePaper(null)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      flush()
    }, BOARD_SAVE_DEBOUNCE_MS)
  }, [setMovablePaper, flush])

  const saveNow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    flush()
  }, [flush])

  return { status, error, retry, onNodeDragStart, onNodeDrag, onNodeDragStop, saveNow }
}
