import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { PaperFlowNode } from '../types/reactflow.types'

const DIRECTIONS: { position: Position; style: React.CSSProperties }[] = [
  { position: Position.Top, style: { left: '50%', transform: 'translateX(-50%)' } },
]

export default function PaperNodeHandles({ data }: Pick<NodeProps<PaperFlowNode>, 'data'>) {
  const visible = data.interactionState !== 'idle'

  return (
    <>
      {DIRECTIONS.map(({ position, style }) => (
        <Handle
          key={`source-${position}`}
          type="source"
          position={position}
          className="h-3! w-3! !border-string/40 bg-paper! "
          style={{ ...style, opacity: visible ? 1 : 0.15 }}
        />
      ))}
      {DIRECTIONS.map(({ position, style }) => (
        <Handle
          key={`target-${position}`}
          type="target"
          position={position}
          className="!h-2.5 !w-2.5 !border-string/40 !bg-paper"
          style={{ ...style, opacity: visible ? 1 : 0.15 }}
        />
      ))}
    </>
  )
}
