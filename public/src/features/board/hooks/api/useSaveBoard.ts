import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Node } from '@xyflow/react'
import { QUERY_KEYS } from '@/constants/query.constants'
import { getApiError } from '@/lib/api-errors'
import { boardApi } from '../../api/board.api'
import { serializeBoardPositions } from '../../utils/board.serializer'
import type { BoardSaveStatus } from '../../types/board.types'

export function useSaveBoard(pageId: number | null) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<BoardSaveStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef<Node[]>([])

  const mutation = useMutation({
    mutationFn: async (nodes: Node[]) => {
      if (pageId === null) return
      const payload = serializeBoardPositions(nodes)
      await boardApi.savePositions(pageId, payload)
    },
    onMutate: (nodes) => {
      pendingRef.current = nodes
      setStatus('saving')
      setError(null)
    },
    onSuccess: () => {
      setStatus('saved')
      if (pageId !== null) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOARD.DATA(pageId) })
      }
    },
    onError: (err: unknown) => {
      setStatus('error')
      setError(getApiError(err))
    },
  })

  async function save(nodes: Node[]): Promise<void> {
    if (nodes.length === 0) return
    pendingRef.current = nodes
    return mutation.mutateAsync(nodes)
  }

  function retry(): void {
    if (pendingRef.current.length > 0) {
      mutation.mutate(pendingRef.current)
    }
  }

  return { save, retry, status, error }
}
