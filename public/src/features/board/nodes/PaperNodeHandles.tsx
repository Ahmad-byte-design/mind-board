import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { PaperFlowNode } from '../types/reactflow.types'

const DIRECTIONS: { position: Position; style: React.CSSProperties }[] = [
  { position: Position.Top, style: { left: '50%', transform: 'translateX(-50%)' } },
]

export default function PaperNodeHandles(_props: Pick<NodeProps<PaperFlowNode>, 'data'>) {
  return (
    <>
      {DIRECTIONS.map(({ position }) => (
        <Handle
          key={`source-${position}`}
          type="source"
          position={position}
          className="h-10! w-10!  bg-transparent! "
          // style={{ ...style, opacity: visible ? 1 : 0.15 }}
          style={{opacity:0}}
        />
      ))}
      {DIRECTIONS.map(({ position }) => (
        <Handle
          key={`target-${position}`}
          type="target"
          position={position}
          className="!h-10 !w-10  !bg-transparent"
          // style={{ ...style, opacity: visible ? 1 : 0.15 }}
          style={{opacity:0}}

        />
      ))}
    </>
  )
}
