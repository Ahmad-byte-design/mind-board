import { describe, expect, it } from 'vitest'
import type { Node } from '@xyflow/react'
import { createMockPaper } from '@/test/factories'
import { paperToNode, nodeToPaper } from '../utils/node.mapper'
import type { PaperFlowNode } from '../types/reactflow.types'

describe('paperToNode', () => {
  it('maps a backend paper to a React Flow paper node', () => {
    const node = paperToNode(createMockPaper({ id: 7, content: 'Hooks', x: 30, y: 40 }))

    expect(node.id).toBe('7')
    expect(node.type).toBe('paper')
    expect(node.position).toEqual({ x: 30, y: 40 })
    expect(node.data).toMatchObject({
      id: 7,
      pageId: 1,
      content: 'Hooks',
      interactionState: 'idle',
    })
  })

  it('defaults the interaction state to idle', () => {
    const node = paperToNode(createMockPaper())
    expect(node.data.interactionState).toBe('idle')
  })

  it('uses the provided interaction state', () => {
    const node = paperToNode(createMockPaper(), 'selected')
    expect(node.data.interactionState).toBe('selected')
  })
})

describe('nodeToPaper', () => {
  it('reads the paper id, x and y back from a flow node', () => {
    const node: PaperFlowNode = {
      id: '3',
      type: 'paper',
      position: { x: 12, y: 34 },
      data: { id: 3, pageId: 1, content: 'x', interactionState: 'idle' },
    }

    expect(nodeToPaper(node)).toEqual({ id: 3, x: 12, y: 34 })
  })

  it('falls back to the string node id when data.id is missing', () => {
    const node = { id: '9', position: { x: 1, y: 2 }, data: {} } as unknown as Node

    expect(nodeToPaper(node)).toEqual({ id: 9, x: 1, y: 2 })
  })
})