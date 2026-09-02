import { describe, expect, it } from 'vitest'
import type { Node } from '@xyflow/react'
import { serializeBoardPositions } from '../utils/board.serializer'

describe('serializeBoardPositions', () => {
  it('maps paper nodes to rounded positions with their ids', () => {
    const nodes = [
      { id: '1', type: 'paper', position: { x: 10.2, y: 20.6 }, data: { id: 1 } },
      { id: '2', type: 'paper', position: { x: -5.5, y: 99.4 }, data: { id: 2 } },
    ] as Node[]

    expect(serializeBoardPositions(nodes)).toEqual([
      { id: 1, x: 10, y: 21 },
      { id: 2, x: -5, y: 99 },
    ])
  })

  it('ignores non-paper nodes', () => {
    const nodes = [
      { id: '1', type: 'paper', position: { x: 0, y: 0 }, data: { id: 1 } },
      { id: '2', type: 'group', position: { x: 10, y: 10 } },
    ] as unknown as Node[]

    expect(serializeBoardPositions(nodes)).toEqual([{ id: 1, x: 0, y: 0 }])
  })

  it('ignores paper nodes without a numeric data id', () => {
    const nodes = [
      { id: '1', type: 'paper', position: { x: 5, y: 5 }, data: {} },
    ] as unknown as Node[]

    expect(serializeBoardPositions(nodes)).toEqual([])
  })

  it('returns an empty array when there are no nodes', () => {
    expect(serializeBoardPositions([])).toEqual([])
  })
})