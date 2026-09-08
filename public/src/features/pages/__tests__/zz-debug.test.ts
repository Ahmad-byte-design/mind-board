import { it, expect } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderHookWithProviders } from '@/test/test-utils'
import { usePages } from '../hooks/api/usePages'

it('debug infinite', async () => {
  const { result } = renderHookWithProviders(() => usePages())
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  console.log('NEXTCURSOR', JSON.stringify(result.current.data?.pages[0].meta))
  console.log('HASNEXT', result.current.hasNextPage)
  const r = await result.current.fetchNextPage()
  console.log('FETCHRESULT', r.status, r.error ? JSON.stringify(r.error) : 'no-error')
  await waitFor(() => expect(result.current.data?.pages).toHaveLength(2))
})
