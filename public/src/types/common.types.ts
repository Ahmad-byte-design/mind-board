export type ID = string | number

export interface Timestamps {
  createdAt: string
  updatedAt: string
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
