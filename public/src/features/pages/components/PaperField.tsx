import { forwardRef } from 'react'

interface PaperFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const PaperField = forwardRef<HTMLInputElement, PaperFieldProps>(
  ({ error, className = '', ...props }, ref) => (
    <div>
      <input
        ref={ref}
        className={`w-full rounded-lg border bg-paper px-4 py-3 text-sm text-ink-paper shadow-inner outline-none transition-colors placeholder:text-ink-muted/40 ${
          error ? 'border-red' : 'border-border-paper focus:border-gold'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-deep">{error}</p>}
    </div>
  ),
)

PaperField.displayName = 'PaperField'

export default PaperField