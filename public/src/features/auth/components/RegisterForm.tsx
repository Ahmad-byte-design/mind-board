import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { useRegister } from '../hooks'
import { toast } from 'sonner'
import { PrimaryBtn, Input, Form, Avatar } from '@/components/ui'
import { getApiError, getApiFieldErrors } from '@/lib/api-errors'
import { ROUTES } from '@/constants/routes.constants'

export default function RegisterForm() {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    if (password !== passwordConfirmation) {
      setFieldErrors({ password_confirmation: 'Passwords do not match' })
      return
    }

    registerMutation.mutate(
      { name, email, password, password_confirmation: passwordConfirmation, avatar: avatar ?? undefined },
      {
        onSuccess: () => {
          toast.success('Welcome to Loom!')
          navigate(ROUTES.LEARNING)
        },
        onError: (error) => {
          const fields = getApiFieldErrors(error)
          if (Object.keys(fields).length > 0) {
            setFieldErrors(fields)
          } else {
            toast.error(getApiError(error))
          }
        },
      }
    )
  }

  return (
    <div>
      <p className="mb-2 font-mono text-xs tracking-widest text-gold uppercase">
        Begin your first map
      </p>
      <h1 className="mb-3 font-hand text-4xl leading-tight text-paper lg:text-5xl">
        Make room for<br />
        <em className="text-gold">curiosity.</em>
      </h1>
      <p className="mb-8 text-sm text-text-dark-muted">
        Your personal learning room is one thoughtful step away.
      </p>

      <div className="auth-tabs mb-6 flex gap-1 rounded-lg bg-surface-dark p-1">
        <button
          onClick={() => navigate('/login')}
          className="flex-1 rounded-md py-2.5 text-sm font-medium text-text-dark-muted transition-colors hover:text-paper"
        >
          Log in
        </button>
        <button className="flex-1 rounded-md bg-workspace py-2.5 text-sm font-medium text-paper shadow-sm">
          Create account
        </button>
      </div>

      <Form onSubmit={handleSubmit}>
        <Avatar onChange={setAvatar} />

        <Input
          label="Name"
          type="text"
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />
        <Input
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <Input
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <Input
          label="Confirm Password"
          type="password"
          required
          placeholder="••••••••"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          error={fieldErrors.password_confirmation}
        />

        <PrimaryBtn
          disabled={registerMutation.isPending}
          loading={registerMutation.isPending}
        >
          Create my learning room
          <ArrowRight size={18} />
        </PrimaryBtn>
      </Form>

      <p className="mt-6 text-center text-xs text-text-dark-muted/60">
        By continuing, you agree to Loom's{' '}
        <span className="underline">Terms</span> and{' '}
        <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  )
}
