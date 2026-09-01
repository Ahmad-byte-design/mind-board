import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  type EdgeTypes,
} from '@xyflow/react'
import { useBoardData } from '../api/useBoardData'
import { boardApi } from '../../api/board.api'
import { paperToNode } from '../../utils/node.mapper'
import { stringToEdge } from '../../utils/edge.mapper'
import PaperNode from '../../nodes/PaperNode'
import RedStringEdge from '../../edges/RedStringEdge'
import { useBoardStore } from '../../store/board.store'
import { useBoardPersistence } from './useBoardPersistence'
import { useBoardInteractions } from './useBoardInteractions'

export function useBoard(pageId: number | null) {
  const boardQuery = useBoardData(pageId)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const nodesRef = useRef(nodes)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  const getNodes = useCallback(() => nodesRef.current, [])

  const nodeTypes = useMemo<NodeTypes>(() => ({ paper: PaperNode }), [])
  const edgeTypes = useMemo<EdgeTypes>(() => ({ redString: RedStringEdge }), [])

  const persistence = useBoardPersistence(pageId, getNodes)
  const interactions = useBoardInteractions({
    getNodes,
    setNodes,
    onDeletePaper: (id: number) => void deletePaper(id),
    onDeleteString: (id: number) => void deleteString(id),
  })

  const initializedRef = useRef<number | null>(null)

  useEffect(() => {
    if (!boardQuery.data || pageId === null) return
    if (initializedRef.current === pageId) return
    initializedRef.current = pageId
    setNodes(boardQuery.data.papers.map((paper) => paperToNode(paper)))
    setEdges(boardQuery.data.strings.map((string) => stringToEdge(string)))
  }, [pageId, boardQuery.data, setNodes, setEdges])

  const createPaper = useCallback(
    async (input: { content: string }) => {
      if (pageId === null) return
      const paper = await boardApi.createPaper(pageId, input)
      setNodes((current) => [...current, paperToNode(paper, 'selected')])
    },
    [pageId, setNodes],
  )

  const deletePaper = useCallback(
    async (paperId: number) => {
      if (pageId === null) return
      await boardApi.deletePaper(paperId)
      setNodes((current) =>
        current.filter((node) => Number(node.id) !== paperId),
      )
      setEdges((current) =>
        current.filter(
          (edge) => edge.source !== String(paperId) && edge.target !== String(paperId),
        ),
      )
    },
    [pageId, setNodes, setEdges],
  )

  const updatePaper = useCallback(
    async (paperId: number, input: { content: string }) => {
      if (pageId === null) return
      const updated = await boardApi.updatePaper(paperId, input)
      setNodes((current) =>
        current.map((node) =>
          Number(node.id) === paperId
            ? {
                ...node,
                data: {
                  ...(node.data as Record<string, unknown>),
                  content: updated.content,
                } as Node['data'],
              }
            : node,
        ),
      )
    },
    [pageId, setNodes],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      if (pageId === null) return
      void boardApi
        .createString(pageId, {
          paper1Id: Number(connection.source),
          paper2Id: Number(connection.target),
        })
        .then((string) => {
          setEdges((current) =>
            addEdge(
              {
                source: connection.source,
                target: connection.target,
                type: 'redString',
                id: String(string.id),
              },
              current,
            ),
          )
        })
    },
    [pageId, setEdges],
  )

  const deleteString = useCallback(
    async (stringId: number) => {
      if (pageId === null) return
      await boardApi.deleteString(stringId)
      setEdges((current) => current.filter((edge) => Number(edge.id) !== stringId))
    },
    [pageId, setEdges],
  )

  const generateBoard = useCallback(async () => {
    if (pageId === null) return
    const board = await boardApi.generateBoard(pageId)
    setNodes(board.papers.map((paper) => paperToNode(paper)))
    setEdges(board.strings.map((string) => stringToEdge(string)))
    useBoardStore.setState({
      selectedPaperId: null,
      selectedStringId: null,
      movablePaperId: null,
      isDetailsPanelOpen: false,
      contextMenu: null,
    })
  }, [pageId, setNodes, setEdges])

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    nodeTypes,
    edgeTypes,
    getNodes,
    setNodes,
    setEdges,
    isLoading: boardQuery.isLoading,
    isError: boardQuery.isError,
    persistence,
    interactions,
    saveStatus: persistence.status,
    saveError: persistence.error,
    retrySave: persistence.retry,
    createPaper,
    deletePaper,
    updatePaper,
    deleteString,
    generateBoard,
  }
}
