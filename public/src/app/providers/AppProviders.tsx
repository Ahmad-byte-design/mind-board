import { Toaster } from 'sonner'
import QueryProvider from './QueryProvider'

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#29231F',
            color: '#FFF8E7',
            border: '1px solid rgba(255, 248, 231, 0.18)',
          },
        }}
      />
    </QueryProvider>
  )
}
