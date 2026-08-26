import type { AxiosError } from 'axios'

interface LaravelValidationErrors {
  [field: string]: string[]
}

interface LaravelErrorResponse {
  message: string
  errors?: LaravelValidationErrors
}

export function getApiError(error: unknown): string {
  const axiosError = error as AxiosError<LaravelErrorResponse>

  if (!axiosError.response?.data) {
    return 'An unexpected error occurred. Please try again.'
  }

  const { message, errors } = axiosError.response.data

  if (errors) {
    const firstField = Object.keys(errors)[0]
    if (firstField) {
      return errors[firstField][0]
    }
  }

  return message || 'An unexpected error occurred. Please try again.'
}

export function getApiFieldErrors(error: unknown): Record<string, string> {
  const axiosError = error as AxiosError<LaravelErrorResponse>
  const fieldErrors: Record<string, string> = {}

  if (axiosError.response?.data?.errors) {
    for (const [field, messages] of Object.entries(axiosError.response.data.errors)) {
      fieldErrors[field] = messages[0]
    }
  }

  return fieldErrors
}
