import { describe, expect, it } from 'vitest'
import { computeRedStringPath } from '../edges/edge.utils'

function nodeLike(overrides: Partial<Parameters<typeof computeRedStringPath>[0]['sourceNode']> = {}) {
  return {
    width: 100,
    measured: { width: 100, height: 60 },
    internals: { positionAbsolute: { x: 0, y: 0 } },
    ...overrides,
  } as Parameters<typeof computeRedStringPath>[0]['sourceNode']
}

describe('computeRedStringPath', () => {
  it('draws a horizontal line between the top centers of both nodes', () => {
    const sourceNode = nodeLike({ internals: { positionAbsolute: { x: 0, y: 0 } } })
    const targetNode = nodeLike({ internals: { positionAbsolute: { x: 200, y: 0 } } })

    const { path } = computeRedStringPath({ sourceNode, targetNode })

    expect(path).toBe('M 50 0 L 250 0')
  })

  it('uses measured dimensions when the older width/height are absent', () => {
    const sourceNode = nodeLike({ width: undefined, measured: { width: 80, height: 40 } })
    const targetNode = nodeLike({ width: undefined, measured: { width: 80, height: 40 }, internals: { positionAbsolute: { x: 100, y: 50 } } })

    const { path } = computeRedStringPath({ sourceNode, targetNode })

    expect(path).toBe('M 40 0 L 140 50')
  })
})