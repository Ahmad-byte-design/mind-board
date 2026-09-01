export type PaperInteractionState = 'idle' | 'selected' | 'movable' | 'dragging'

export interface Paper {
  id: number
  pageId: number
  content: string
  x: number
  y: number
  createdAt: string
  updatedAt: string
}

export interface PaperString {
  id: number
  paper1Id: number
  paper2Id: number
}

export type PaperCanvasData = {
  id: number
  pageId: number
  content: string
  interactionState: PaperInteractionState
} & Record<string, unknown>

export interface BoardSavePayload {
  papers?: {
    id: number
    x: number
    y: number
  }[]
  strings?: {
    paper1Id: number
    paper2Id: number
  }[]
}

export interface BoardSaveResult {
  createdStrings: PaperString[]
}

export type BoardSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface BoardState {
  status: BoardSaveStatus
  error?: string | null
}
