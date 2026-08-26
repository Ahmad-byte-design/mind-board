import { useRef, useState } from 'react'
import { Camera } from 'lucide-react'

interface AvatarProps {
  preview?: string | null
  onChange?: (file: File | null) => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-16 w-16',
  md: 'h-20 w-20',
  lg: 'h-24 w-24',
}

export default function Avatar({ preview, onChange, size = 'md' }: AvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  const displayPreview = preview ?? localPreview

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) return
      const reader = new FileReader()
      reader.onloadend = () => setLocalPreview(reader.result as string)
      reader.readAsDataURL(file)
      onChange?.(file)
    }
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`group relative overflow-hidden rounded-full border-2 border-border-dark bg-surface-dark transition-colors hover:border-gold/50 ${sizeMap[size]}`}
      >
        {displayPreview ? (
          <img src={displayPreview} alt="Avatar" className="h-full w-full rounded-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Camera size={24} className="text-text-dark-muted transition-colors group-hover:text-paper" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera size={20} className="text-paper" />
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
