import type { Edge } from '@xyflow/react'
import type { PaperString } from '../types/board.types'
import type { StringFlowEdge } from '../types/reactflow.types'

export function stringToEdge(string: PaperString): StringFlowEdge {
  return {
    id: String(string.id),
    type: 'redString',
    source: String(string.paper1Id),
    target: String(string.paper2Id),
    selectable: true,
  }
}

export function edgeToString(edge: Edge): Partial<PaperString> {
  return {
    id: Number(edge.id),
  }
}
