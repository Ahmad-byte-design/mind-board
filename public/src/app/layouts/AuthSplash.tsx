import { Image } from '@/components/ui'
import logo from '@/assets/images/logo.png'

export function AuthSplash() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-ink-deep">
      <div className="flex items-center gap-2">
        <Image
          src={logo}
          alt="Loom"
          className="h-10 w-10 rounded-md object-cover shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        />
        <b className="font-sans text-lg font-semibold text-paper">Loom</b>
      </div>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-paper/20 border-t-gold" />
    </div>
  )
}
