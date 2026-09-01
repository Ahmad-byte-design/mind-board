import type { Node } from '@xyflow/react'
import type { PaperFlowNode } from '../types/reactflow.types'

export interface PaperPositionChange {
  id: number
  x: number
  y: number
}

export function serializeBoardPositions(nodes: Node[]): PaperPositionChange[] {
  return nodes
    .filter(isPaperNode)
    .map((node) => ({
      id: Number(node.id),
      x: Math.round(node.position.x),
      y: Math.round(node.position.y),
    }))
}

function isPaperNode(node: Node): node is PaperFlowNode {
  return node.type === 'paper' && typeof node.data?.id === 'number'
}
