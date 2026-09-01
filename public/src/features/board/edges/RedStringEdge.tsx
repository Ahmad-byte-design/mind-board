import { BaseEdge, useInternalNode, type EdgeProps } from '@xyflow/react'
import { RED_STRING_STROKE, RED_STRING_STROKE_WIDTH } from '../constants/board.constants'
import { computeRedStringPath } from './edge.utils'

export default function RedStringEdge({
  id,
  source,
  target,
  selected,
}: EdgeProps) {
  const sourceNode = useInternalNode(source)
  const targetNode = useInternalNode(target)

  if (!sourceNode || !targetNode) return null

  const { path } = computeRedStringPath({ sourceNode, targetNode })

  return (
    <BaseEdge
      id={id} 
      path={path}
      style={{
        stroke: RED_STRING_STROKE,
        strokeWidth: selected ? RED_STRING_STROKE_WIDTH + 3 : RED_STRING_STROKE_WIDTH,
        fill: 'none',
        strokeLinecap: 'round',
        filter: 'drop-shadow(0 1px 1px rgba(23, 21, 16, 0.18))',
      }}
    />
  )
}
