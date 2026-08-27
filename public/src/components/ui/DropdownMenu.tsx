import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface DropdownItem {
  label: string
  icon?: React.ReactNode
  danger?: boolean
  onSelect: () => void
}

interface DropdownMenuProps {
  trigger: (isOpen: boolean) => React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
}

const MENU_GAP = 6
const VIEWPORT_MARGIN = 8

export default function DropdownMenu({ trigger, items, align = 'right' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [triggerRect, setTriggerRect] = useState<{ top: number; left: number; width: number } | null>(null)
  const [menuSize, setMenuSize] = useState<{ width: number; height: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const openMenu = () => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) setTriggerRect({ top: rect.top, left: rect.left, width: rect.width })
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (containerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const handleReposition = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        setOpen(false)
        return
      }
      setTriggerRect({ top: rect.top, left: rect.left, width: rect.width })
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleReposition, true)
    window.addEventListener('resize', handleReposition)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open || !menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    setMenuSize({ width: rect.width, height: rect.height })
  }, [open])

  const menuWidth = menuSize?.width ?? 160
  const menuHeight = menuSize?.height ?? 0

  let left = 0
  if (triggerRect) {
    if (align === 'right') {
      left = triggerRect.left + triggerRect.width - menuWidth
    } else {
      left = triggerRect.left
    }
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - menuWidth - VIEWPORT_MARGIN))
  }

  let top = (triggerRect?.top ?? 0) + MENU_GAP
  if (triggerRect && top + menuHeight > window.innerHeight - VIEWPORT_MARGIN) {
    top = Math.max(VIEWPORT_MARGIN, triggerRect.top - menuHeight - MENU_GAP)
  }

  return (
    <div ref={containerRef} className="inline-flex">
      <div onClick={open ? () => setOpen(false) : openMenu}>{trigger(open)}</div>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              style={{ top, left }}
              className={cn(
                'fixed z-[60] min-w-40 overflow-hidden rounded-xl border border-border-paper/70 bg-paper py-1.5 text-ink-paper shadow-[0_16px_40px_rgba(0,0,0,0.4)]',
              )}
            >
              {items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    item.onSelect()
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors hover:bg-paper-muted',
                    item.danger ? 'text-red-deep' : 'text-ink-paper',
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}