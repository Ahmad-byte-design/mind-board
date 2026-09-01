interface InternalNodeLike {
  width?: number
  height?: number
  measured?: { width?: number; height?: number }
  internals: { positionAbsolute: { x: number; y: number } }
}

interface NodeBounds {
  x: number
  y: number
  width: number
  height: number
}

function boundsOf(node: InternalNodeLike): NodeBounds {
  const { positionAbsolute } = node.internals
  const width = node.measured?.width ?? node.width ?? 0
  const height = node.measured?.height ?? node.height ?? 0
  return { x: positionAbsolute.x, y: positionAbsolute.y, width, height }
}

function topCenter(bounds: NodeBounds): { x: number; y: number } {
  return { x: bounds.x + bounds.width / 2, y: bounds.y }
}

export interface RedStringPath {
  path: string
}

export function computeRedStringPath({
  sourceNode,
  targetNode,
}: {
  sourceNode: InternalNodeLike
  targetNode: InternalNodeLike
}): RedStringPath {
  const source = topCenter(boundsOf(sourceNode))
  const target = topCenter(boundsOf(targetNode))

  return { path: `M ${source.x} ${source.y} L ${target.x} ${target.y}` }
}