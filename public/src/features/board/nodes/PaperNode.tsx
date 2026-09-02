import { memo } from 'react'
import { motion } from 'motion/react'
import type { NodeProps } from '@xyflow/react'
import paperNote from '@/assets/images/paper-note.png'
import { useBoardStore } from '../store/board.store'
import PaperNodeHandles from './PaperNodeHandles'
import type { PaperFlowNode } from '../types/reactflow.types'

const PAPER_NOTE_WIDTH = 232

function PaperNodeInner({ data, selected, dragging }: NodeProps<PaperFlowNode>) {
  const movablePaperId = useBoardStore((state) => state.movablePaperId)
  const movable = movablePaperId === data.id

  return (
    <motion.div
      className="relative select-none"
      style={{
        width: PAPER_NOTE_WIDTH,
        cursor: dragging ? 'grabbing' : movable ? 'grab' : 'pointer',
      }}
      animate={{
        scale: dragging ? 1.06 : movable ? 1.03 : 1,
        rotate: dragging ? 1.6 : movable ? -0.7 : selected ? -0.4 : 0,
        filter:
          dragging || movable || selected
            ? 'drop-shadow(0 10px 14px rgba(23,21,16,0.35))'
            : 'drop-shadow(0 3px 5px rgba(23,21,16,0.28))',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <div className="relative">
        <img
          src={paperNote}
          alt=""
          draggable={false}
          className="block h-auto w-full object-contain"
        />

        <PaperNodeHandles data={data} />

        <div className="absolute inset-x-0 top-[34%] px-[16%] text-center">
          <p className="font-hand line-clamp-5 wrap-break-word text-2xl leading-[1.6] text-ink-paper">
            {data.content}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

const PaperNode = memo(PaperNodeInner)
export default PaperNode
