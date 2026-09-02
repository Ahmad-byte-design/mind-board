import { describe, expect, it } from 'vitest'
import type { Edge } from '@xyflow/react'
import { createMockString } from '@/test/factories'
import { stringToEdge, edgeToString } from '../utils/edge.mapper'

describe('stringToEdge', () => {
  it('maps a backend string to a redString React Flow edge', () => {
    const edge = stringToEdge(createMockString({ id: 42, paper1Id: 8, paper2Id: 9 }))

    expect(edge.id).toBe('42')
    expect(edge.type).toBe('redString')
    expect(edge.source).toBe('8')
    expect(edge.target).toBe('9')
    expect(edge.selectable).toBe(true)
  })
})

describe('edgeToString', () => {
  it('reads the string id back from the edge id', () => {
    const edge = { id: '13' } as Edge

    expect(edgeToString(edge)).toEqual({ id: 13 })
  })
})