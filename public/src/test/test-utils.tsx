import { type ReactElement, type ReactNode } from 'react'
import { render, renderHook, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export interface RenderWithProvidersOptions extends RenderOptions {
  queryClient?: QueryClient
  route?: string
}

interface ProviderOptions {
  queryClient?: QueryClient
  route?: string
}

export function Providers({ queryClient, route }: ProviderOptions) {
  function Wrapper({ children }: { children: ReactNode }) {
    if (route !== undefined) {
      return (
        <QueryClientProvider client={queryClient!}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </QueryClientProvider>
      )
    }
    return <QueryClientProvider client={queryClient!}>{children}</QueryClientProvider>
  }
  return Wrapper
}

export function renderWithProviders(
  ui: ReactElement,
  { queryClient = createTestQueryClient(), route, ...renderOptions }: RenderWithProvidersOptions = {},
) {
  const Wrapper = Providers({ queryClient, route })
  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

export function renderHookWithProviders<Result, Props>(
  hook: (initialProps: Props) => Result,
  {
    queryClient = createTestQueryClient(),
    initialProps,
    route,
  }: {
    queryClient?: QueryClient
    initialProps?: Props
    route?: string
  } = {},
) {
  const Wrapper = Providers({ queryClient, route })
  return { ...renderHook(hook, { wrapper: Wrapper, initialProps }), queryClient }
}