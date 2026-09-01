import { useEffect } from 'react'
import { Trash2 } from 'lucide-react'

interface StringDeleteButtonProps {
  x: number
  y: number
  busy?: boolean
  onDelete: () => void
  onClose: () => void
}

export default function StringDeleteButton({
  x,
  y,
  busy = false,
  onDelete,
  onClose,
}: StringDeleteButtonProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <button
      type="button"
      aria-label="Delete string"
      title="Delete string"
      disabled={busy}
      onClick={onDelete}
      className="pointer-events-auto absolute z-[6] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-red-deep text-white shadow-[0_3px_10px_rgba(23,21,16,0.45)] transition-transform hover:scale-110 hover:bg-red disabled:opacity-60"
      style={{ left: x, top: y }}
    >
      <Trash2 size={16} />
    </button>
  )
}
