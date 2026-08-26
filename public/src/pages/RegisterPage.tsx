import AuthLayout from '@/app/layouts/AuthLayout'
import RegisterForm from '@/features/auth/components/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthLayout mode="signup">
      <RegisterForm />
    </AuthLayout>
  )
}
