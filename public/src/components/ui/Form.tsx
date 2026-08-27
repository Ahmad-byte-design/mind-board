import type { FormHTMLAttributes } from 'react'

type FormProps = FormHTMLAttributes<HTMLFormElement>

export default function Form({ children, className = 'space-y-4', ...props }: FormProps) {
  return (
    <form className={className} {...props}>
      {children}
    </form>
  )
}
