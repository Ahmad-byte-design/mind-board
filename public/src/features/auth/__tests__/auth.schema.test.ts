import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema, updateProfileSchema } from '../schemas/auth.schema'

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'john@example.com',
      password: 'secret12',
      remember: false,
    })
    expect(result.success).toBe(true)
  })

  it('accepts a valid email with remember enabled', () => {
    const result = loginSchema.safeParse({
      email: 'a@b.co',
      password: 'secret12',
      remember: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a malformed email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret12',
      remember: false,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email'])
    }
  })

  it('rejects a password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({
      email: 'john@example.com',
      password: '12345',
      remember: false,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['password'])
      expect(result.error.issues[0].message).toContain('at least 6')
    }
  })

  it('rejects missing fields', () => {
    const result = loginSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects an incorrect type for remember', () => {
    const result = loginSchema.safeParse({
      email: 'john@example.com',
      password: 'secret12',
      remember: 'yes',
    })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const valid = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'secret12',
    password_confirmation: 'secret12',
  }

  it('accepts a valid registration', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts an optional avatar file', () => {
    const avatar = new File(['x'], 'photo.png', { type: 'image/png' })
    const result = registerSchema.safeParse({ ...valid, avatar })
    expect(result.success).toBe(true)
  })

  it('rejects a name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'A' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['name'])
    }
  })

  it('rejects a malformed email', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'oops' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email'])
    }
  })

  it('rejects mismatched password confirmation', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password_confirmation: 'different',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('do not match')
      expect(result.error.issues[0].path).toEqual(['password_confirmation'])
    }
  })

  it('rejects an avatar that is not a File', () => {
    const result = registerSchema.safeParse({ ...valid, avatar: 'path.png' })
    expect(result.success).toBe(false)
  })
})

describe('updateProfileSchema', () => {
  it('accepts a valid profile update', () => {
    expect(
      updateProfileSchema.safeParse({ name: 'Jane Doe', email: 'jane@example.com' }).success,
    ).toBe(true)
  })

  it('accepts an avatar file', () => {
    const avatar = new File(['x'], 'avatar.png', { type: 'image/png' })
    expect(updateProfileSchema.safeParse({ name: 'Jane', email: 'jane@example.com', avatar }).success).toBe(true)
  })

  it('rejects a name shorter than 2 characters', () => {
    const result = updateProfileSchema.safeParse({ name: 'J', email: 'jane@example.com' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['name'])
    }
  })

  it('rejects an invalid email', () => {
    const result = updateProfileSchema.safeParse({ name: 'Jane', email: 'nope' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email'])
    }
  })
})