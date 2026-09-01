import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { BookOpen, X } from 'lucide-react'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type NodeMouseHandler,
  type ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getApiError } from '@/lib/api-errors'
import { useBoardStore } from '../store/board.store'
import { useBoard } from '../hooks/ui/useBoard'
import BoardStatus from './BoardStatus'
import BoardToolbar from './BoardToolbar'
import GenerateBoardDialog from './GenerateBoardDialog'
import PaperContextMenu from './PaperContextMenu'
import PaperDetailsPanel from './PaperDetailsPanel'
import StringDeleteButton from './StringDeleteButton'
import type { PaperFlowNode } from '../types/reactflow.types'
import type { Page } from '@/features/pages/types/page.types'

interface LearningBoardProps {
  page: Page | null
  isMobile: boolean
  onOpenNotebook: () => void
}

interface NewPaperState {
  open: boolean
  content: string
  submitting: boolean
}

export default function LearningBoard({ page, isMobile, onOpenNotebook }: LearningBoardProps) {
  const board = useBoard(page?.id ?? null)
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)

  const selectedPaperId = useBoardStore((state) => state.selectedPaperId)
  const selectedStringId = useBoardStore((state) => state.selectedStringId)
  const movablePaperId = useBoardStore((state) => state.movablePaperId)
  const isDetailsPanelOpen = useBoardStore((state) => state.isDetailsPanelOpen)
  const contextMenu = useBoardStore((state) => state.contextMenu)
  const setSelectedString = useBoardStore((state) => state.setSelectedString)

  const [newPaper, setNewPaper] = useState<NewPaperState>({
    open: false,
    content: '',
    submitting: false,
  })
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const selectedPaper = useMemo(() => {
    if (selectedPaperId === null) return null
    const node = board.nodes.find(
      (candidate): candidate is PaperFlowNode =>
        candidate.type === 'paper' && (candidate.data as { id: number }).id === selectedPaperId,
    )
    return (node?.data as PaperFlowNode['data']) ?? null
  }, [board.nodes, selectedPaperId])

  const selectedStringPosition = useMemo(() => {
    if (selectedStringId === null || rfInstance === null) return null
    const edge = board.edges.find((candidate) => Number(candidate.id) === selectedStringId)
    if (!edge) return null
    const source = board.nodes.find((node) => node.id === edge.source)
    const target = board.nodes.find((node) => node.id === edge.target)
    if (!source || !target) return null
    const sx = source.position.x + (source.width ?? 0) / 2
    const sy = source.position.y + (source.height ?? 0) / 2
    const tx = target.position.x + (target.width ?? 0) / 2
    const ty = target.position.y + (target.height ?? 0) / 2
    const flowX = (sx + tx) / 2
    const flowY = (sy + ty) / 2
    const { x, y, zoom } = rfInstance.getViewport()
    return { x: flowX * zoom + x, y: flowY * zoom + y }
  }, [selectedStringId, rfInstance, board.edges, board.nodes])

  const handleDeleteString = () => {
    if (selectedStringId === null) return
    const id = selectedStringId
    setSelectedString(null)
    void board.deleteString(id)
  }

  const handlePaneClick = () => {
    board.interactions.handlePaneClick()
    setNewPaper((state) => ({ ...state, open: false }))
  }

  const handleNodeClick: NodeMouseHandler = (event, node) => {
    setNewPaper((state) => ({ ...state, open: false }))
    board.interactions.handleNodeClick(event, node as PaperFlowNode)
  }

  const handleToggleDetails = () => {
    if (selectedPaperId !== null) {
      useBoardStore.setState({ isDetailsPanelOpen: !isDetailsPanelOpen })
    }
  }

  const handleCreatePaper = async () => {
    if (!newPaper.content.trim()) return
    setNewPaper((state) => ({ ...state, submitting: true }))
    await board.createPaper({
      content: newPaper.content.trim(),
    })
    setNewPaper({ open: false, content: '', submitting: false })
    rfInstance?.fitView({ padding: 0.2, duration: 400 })
  }

  const handleUpdatePaper = (input: { content: string }) => {
    if (selectedPaperId === null) return
    void board.updatePaper(selectedPaperId, input)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      await board.generateBoard()
      setIsGenerateOpen(false)
      toast.success('Board generated successfully.')
      rfInstance?.fitView({ padding: 0.2, duration: 400 })
    } catch (error) {
      toast.error(getApiError(error))
    } finally {
      setIsGenerating(false)
    }
  }

  if (board.isLoading) {
    return (
      <main className="wood-frame relative flex-1">
        <div className="cork-texture absolute inset-3 overflow-hidden rounded-2xl sm:inset-4">
          <div className="flex h-full items-center justify-center">
            <div className="animate-pulse text-paper/60">Loading your knowledge map…</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="wood-frame relative flex-1 overflow-hidden">
      <div className="cork-texture absolute inset-3 overflow-hidden rounded-2xl shadow-[inset_0_2px_16px_rgba(23,21,16,0.5)] sm:inset-4">
        <BoardToolbar
          selectedPaperId={selectedPaperId}
          movablePaperId={movablePaperId}
          isDetailsPanelOpen={isDetailsPanelOpen}
          rfInstance={rfInstance}
          onNewPaper={() => setNewPaper((state) => ({ ...state, open: !state.open }))}
          onDelete={() => {
            if (selectedPaperId !== null) void board.deletePaper(selectedPaperId)
          }}
          onToggleDetails={handleToggleDetails}
          onGenerate={() => setIsGenerateOpen(true)}
        />

        <ReactFlow
          nodes={board.nodes}
          edges={board.edges}
          onNodesChange={board.onNodesChange}
          onEdgesChange={board.onEdgesChange}
          onConnect={board.onConnect}
          nodeTypes={board.nodeTypes}
          edgeTypes={board.edgeTypes}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={board.interactions.handleNodeDoubleClick}
          onNodeContextMenu={board.interactions.handleNodeContextMenu}
          onPaneClick={handlePaneClick}
          onPaneContextMenu={(event) => event.preventDefault()}
          onNodeDragStart={board.persistence.onNodeDragStart}
          onNodeDrag={board.persistence.onNodeDrag}
          onNodeDragStop={board.persistence.onNodeDragStop}
          onEdgeClick={(_event, edge) => {
            setSelectedString(Number(edge.id))
            useBoardStore.setState({ selectedPaperId: null, isDetailsPanelOpen: false })
          }}
          onInit={(instance) => setRfInstance(instance)}
          defaultEdgeOptions={{ type: 'redString' }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
          className="h-full! w-full!" 
          // type='custom-edge'
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1.4}
            color="rgba(23,21,16,0.16)"
          />
          <Controls
            position="bottom-left"
            className="!border-border-paper/50 !bg-paper/90 ![--xy-controls-button-color:var(--color-red)]"
          />
        </ReactFlow>

        <GenerateBoardDialog
          open={isGenerateOpen}
          onClose={() => setIsGenerateOpen(false)}
          onConfirm={handleGenerate}
          isPending={isGenerating}
        />

        {isDetailsPanelOpen && (
          <PaperDetailsPanel
            key={selectedPaper?.id ?? 'none'}
            paper={selectedPaper}
            onUpdate={handleUpdatePaper}
            onClose={() => useBoardStore.setState({ isDetailsPanelOpen: false })}
          />
        )}

        {selectedStringId !== null && selectedStringPosition && (
          <StringDeleteButton
            key={selectedStringId}
            x={selectedStringPosition.x}
            y={selectedStringPosition.y}
            onDelete={handleDeleteString}
            onClose={() => setSelectedString(null)}
          />
        )}

        {newPaper.open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto absolute left-1/2 top-16 z-[6] w-72 -translate-x-1/2 rounded-2xl border border-border-paper bg-paper p-3 shadow-[0_18px_50px_rgba(23,21,16,0.55)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-hand text-lg font-semibold text-ink-paper">New paper</span>
              <button
                type="button"
                onClick={() => setNewPaper((state) => ({ ...state, open: false }))}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-muted hover:bg-paper-muted"
              >
                <X size={15} />
              </button>
            </div>
            <div className="space-y-2">
              <textarea
                autoFocus
                value={newPaper.content}
                onChange={(event) => setNewPaper((state) => ({ ...state, content: event.target.value }))}
                rows={5}
                placeholder="Concept notes..."
                className="w-full resize-none rounded-lg border border-border-paper bg-paper-muted/60 px-2.5 py-2 text-sm text-ink-muted outline-none focus:border-red/50"
              />
              <button
                type="button"
                disabled={!newPaper.content.trim() || newPaper.submitting}
                onClick={handleCreatePaper}
                className="w-full rounded-lg bg-red py-2 text-sm font-semibold text-paper transition-colors hover:bg-red-deep disabled:opacity-50"
              >
                {newPaper.submitting ? 'Creating…' : 'Create paper'}
              </button>
            </div>
          </motion.div>
        )}

        <div className="pointer-events-none absolute bottom-4 right-4 z-[4]">
          <BoardStatus
            status={board.saveStatus}
            error={board.saveError}
            onRetry={() => board.retrySave()}
          />
        </div>

        {contextMenu && (
          <PaperContextMenu
            menu={contextMenu}
            onClose={() => useBoardStore.setState({ contextMenu: null })}
            onView={(id) => {
              useBoardStore.setState({ contextMenu: null, selectedPaperId: id, isDetailsPanelOpen: true })
            }}
            onEdit={(id) => {
              useBoardStore.setState({ contextMenu: null, selectedPaperId: id, isDetailsPanelOpen: true })
            }}
            onDelete={(id) => {
              useBoardStore.setState({ contextMenu: null })
              void board.deletePaper(id)
            }}
          />
        )}

        {isMobile && (
          <motion.button
            type="button"
            onClick={onOpenNotebook}
            aria-label="Open learning notebook"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.94 }}
            className="absolute bottom-5 right-5 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border-paper/40 bg-notebook text-ink-paper shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          >
            <BookOpen size={24} />
          </motion.button>
        )}
      </div>
    </main>
  )
}
