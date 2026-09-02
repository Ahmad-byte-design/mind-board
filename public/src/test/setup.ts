import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import '@/i18n'
import { server } from './mocks/server'
import './mocks/browser'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})