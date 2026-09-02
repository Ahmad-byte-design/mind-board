import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  variant?: 'dark' | 'light'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type, error, variant = 'dark', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type
    const isLight = variant === 'light'

    return (
      <div>
        {label && (
          <label className={`mb-1.5 block font-mono text-xs tracking-wider uppercase ${
            isLight ? 'text-ink-muted' : 'text-text-dark-muted'
          }`}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition-colors ${
              isLight
                ? 'border-border-paper bg-paper text-ink-paper placeholder:text-ink-muted/50'
                : 'border-border-dark bg-surface-dark text-paper placeholder-text-dark-muted/50'
            } ${
              error
                ? 'border-red'
                : isLight
                  ? 'focus:border-gold'
                  : 'focus:border-gold/50'
            } ${isPassword ? 'pr-12' : ''} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                isLight ? 'text-ink-muted hover:text-ink-paper' : 'text-text-dark-muted hover:text-paper'
              }`}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
