import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, type, error, className = '', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div>
      {label && (
        <label className="mb-1.5 block font-mono text-xs tracking-wider text-text-dark-muted uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={`w-full rounded-lg border bg-surface-dark px-4 py-3 text-sm text-paper placeholder-text-dark-muted/50 outline-none transition-colors ${
            error ? 'border-red' : 'border-border-dark focus:border-gold/50'
          } ${isPassword ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dark-muted transition-colors hover:text-paper"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
