import type { Node } from '@xyflow/react'
import type { Paper, PaperCanvasData } from '../types/board.types'
import type { PaperFlowNode } from '../types/reactflow.types'

export function paperToNode(
  paper: Paper,
  interactionState: PaperCanvasData['interactionState'] = 'idle',
): PaperFlowNode {
  const data: PaperCanvasData = {
    id: paper.id,
    pageId: paper.pageId,
    content: paper.content,
    interactionState,
  }

  return {
    id: String(paper.id),
    type: 'paper',
    position: { x: paper.x, y: paper.y },
    data,
  }
}

export function nodeToPaper(node: PaperFlowNode | Node): Partial<Paper> {
  const data = node.data as PaperCanvasData
  return {
    id: data?.id ?? Number(node.id),
    x: node.position.x,
    y: node.position.y,
  }
}
