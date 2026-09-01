import { useNavigate } from 'react-router'
import { Image } from '@/components/ui'
import landingImg from '@/assets/images/landing.jpg'
import logo from '@/assets/images/logo.png'

interface AuthLayoutProps {
  children: React.ReactNode
  mode: 'login' | 'signup'
}

export default function AuthLayout({ children, mode }: AuthLayoutProps) {
  const navigate = useNavigate()
  const isLogin = mode === 'login'

  return (
    <main className="flex min-h-dvh">
      <section className="auth-form-side flex w-full flex-col bg-ink-deep px-6 py-8 lg:w-1/2 lg:px-16 lg:py-12">
        <div className="auth-top mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-6 text-sm text-text-dark-muted transition-colors hover:text-paper lg:hidden"
          >
            ← Home
          </button>

          <div className="brand-mark mb-4 flex items-center gap-2">
            <Image
              src={logo}
              alt="Loom"
              className="h-8 w-8 rounded-md object-cover shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            />
            <b className="font-sans text-lg font-semibold text-paper">Loom</b>
          </div>

          <p className="text-sm text-text-dark-muted">
            {isLogin ? 'New here?' : 'Already have a map?'}{' '}
            <button
              onClick={() => navigate(isLogin ? '/register' : '/login')}
              className="font-medium text-gold transition-colors hover:text-gold/80"
            >
              {isLogin ? 'Create an account' : 'Log in'}
            </button>
          </p>
        </div>

        <div className="auth-paper flex-1">
          {children}
        </div>
      </section>

      <section className="auth-image relative hidden w-1/2 lg:flex">
        <button
          onClick={() => navigate('/')}
          className="absolute left-6 top-6 z-10 text-sm text-paper/70 transition-colors hover:text-paper"
        >
          ← Back to home
        </button>
        <Image
          src={landingImg}
          alt="Loom"
          className="h-full w-full object-cover opacity-75"
        />
      </section>
    </main>
  )
}
