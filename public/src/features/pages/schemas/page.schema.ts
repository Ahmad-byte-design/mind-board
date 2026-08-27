import { z } from 'zod'

export const createPageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(60, 'Title must be at most 60 characters'),
})

export type CreatePageFormData = z.infer<typeof createPageSchema>