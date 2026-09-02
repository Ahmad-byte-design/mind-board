import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useLogin } from '../hooks'
import { toast } from 'sonner'
import { PrimaryBtn, Input, Form } from '@/components/ui'
import { getApiError } from '@/lib/api-errors'
import { ROUTES } from '@/constants/routes.constants'
import { loginSchema, type LoginFormData } from '../schemas/auth.schema'

export default function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Welcome back!')
        navigate(ROUTES.LEARNING)
      },
      onError: (error) => {
        toast.error(getApiError(error))
      },
    })
  })

  return (
    <div>
      <p className="mb-2 font-mono text-xs tracking-widest text-gold uppercase">
        Welcome back
      </p>
      <h1 className="mb-3 font-hand text-4xl leading-tight text-paper lg:text-5xl">
        Pick up your<br />
        <em className="text-gold">thread.</em>
      </h1>
      <p className="mb-8 text-sm text-text-dark-muted">
        Your learning room has been waiting for you.
      </p>

      <div className="auth-tabs mb-6 flex gap-1 rounded-lg bg-surface-dark p-1">
        <button className="flex-1 rounded-md bg-workspace py-2.5 text-sm font-medium text-paper shadow-sm">
          Log in
        </button>
        <button
          onClick={() => navigate('/register')}
          className="flex-1 rounded-md py-2.5 text-sm font-medium text-text-dark-muted transition-colors hover:text-paper"
        >
          Create account
        </button>
      </div>

      <Form onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          required
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border-dark bg-surface-dark accent-gold"
            {...register('remember')}
          />
          <label className="text-sm text-text-dark-muted">Remember me</label>
        </div>

        <PrimaryBtn
          disabled={loginMutation.isPending}
          loading={loginMutation.isPending}
        >
          Enter my learning room
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