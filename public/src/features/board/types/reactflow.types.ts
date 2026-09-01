import type { Node, Edge } from '@xyflow/react'
import type { PaperCanvasData } from './board.types'

export type PaperFlowNode = Node<PaperCanvasData, 'paper'>

export type StringFlowEdge = Edge<Record<string, unknown>, 'redString'>
