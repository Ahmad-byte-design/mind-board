import { describe, expect, it } from 'vitest'
import { createPageSchema } from '../schemas/page.schema'

describe('createPageSchema', () => {
  it('accepts a valid title', () => {
    expect(createPageSchema.safeParse({ title: 'Learn React' }).success).toBe(true)
  })

  it('trims surrounding whitespace before validating length', () => {
    expect(createPageSchema.safeParse({ title: '  React  ' }).success).toBe(true)
  })

  it('accepts titles at the exact boundaries', () => {
    expect(createPageSchema.safeParse({ title: 'ab' }).success).toBe(true)
    expect(createPageSchema.safeParse({ title: 'a'.repeat(60) }).success).toBe(true)
  })

  it('rejects a missing title', () => {
    const result = createPageSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects a title shorter than 2 characters after trimming', () => {
    const result = createPageSchema.safeParse({ title: ' ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['title'])
      expect(result.error.issues[0].message).toContain('at least 2')
    }
  })

  it('rejects a title longer than 60 characters', () => {
    const result = createPageSchema.safeParse({ title: 'a'.repeat(61) })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['title'])
      expect(result.error.issues[0].message).toContain('at most 60')
    }
  })

  it('rejects a non-string title', () => {
    const result = createPageSchema.safeParse({ title: 123 })
    expect(result.success).toBe(false)
  })
})