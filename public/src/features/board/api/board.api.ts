import api from '@/lib/axios'
import { BOARD_ENDPOINTS } from '../constants/board.constants'
import type { Paper, PaperString } from '../types/board.types'

interface RawPaper {
  id: number
  page_id: number
  content: string
  x: number
  y: number
  created_at: string
  updated_at: string
}

interface RawString {
  id: number
  paper1_id: number
  paper2_id: number
}

interface RawSinglePaperResponse {
  message: string
  paper: RawPaper
}

interface RawSingleStringResponse {
  message: string
  string: RawString
}

interface RawGenerateResponse {
  message: string
  papers: RawPaper[]
  strings: RawString[]
}

function mapPaper(raw: RawPaper): Paper {
  return {
    id: raw.id,
    pageId: raw.page_id,
    content: raw.content,
    x: raw.x,
    y: raw.y,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

function mapString(raw: RawString): PaperString {
  return {
    id: raw.id,
    paper1Id: raw.paper1_id,
    paper2Id: raw.paper2_id,
  }
}

export interface BoardData {
  papers: Paper[]
  strings: PaperString[]
}

export const boardApi = {
  getBoard: async (pageId: number): Promise<BoardData> => {
    const response = await api.get<{ papers: RawPaper[]; strings: RawString[] }>(
      BOARD_ENDPOINTS.BOARD(pageId),
    )
    return {
      papers: response.data.papers.map(mapPaper),
      strings: response.data.strings.map(mapString),
    }
  },

  savePositions: async (
    pageId: number,
    papers: { id: number; x: number; y: number }[],
  ): Promise<void> => {
    const response = await api.patch(BOARD_ENDPOINTS.BOARD(pageId), {
      papers: papers.map((p) => ({ id: p.id, x: p.x, y: p.y })),
    })
    return response.data
  },

  createPaper: async (pageId: number, input: { content: string }): Promise<Paper> => {
    const response = await api.post<RawSinglePaperResponse>(
      BOARD_ENDPOINTS.PAPERS_CREATE(pageId),
      input,
    )
    return mapPaper(response.data.paper)
  },

  updatePaper: async (id: number, input: { content: string }): Promise<Paper> => {
    const response = await api.put<RawSinglePaperResponse>(BOARD_ENDPOINTS.PAPER_UPDATE(id), input)
    return mapPaper(response.data.paper)
  },

  deletePaper: async (id: number): Promise<void> => {
    await api.delete(BOARD_ENDPOINTS.PAPER_DELETE(id))
  },

  createString: async (
    pageId: number,
    input: { paper1Id: number; paper2Id: number },
  ): Promise<PaperString> => {
    const response = await api.post<RawSingleStringResponse>(BOARD_ENDPOINTS.STRINGS_CREATE(pageId), {
      paper1_id: input.paper1Id,
      paper2_id: input.paper2Id,
    })
    return mapString(response.data.string)
  },

  deleteString: async (id: number): Promise<void> => {
    await api.delete(BOARD_ENDPOINTS.STRING_DELETE(id))
  },

  generateBoard: async (pageId: number): Promise<BoardData> => {
    const response = await api.post<RawGenerateResponse>(BOARD_ENDPOINTS.BOARD_GENERATE(pageId))
    return {
      papers: response.data.papers.map(mapPaper),
      strings: response.data.strings.map(mapString),
    }
  },
}
