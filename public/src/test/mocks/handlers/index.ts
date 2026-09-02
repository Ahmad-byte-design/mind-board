import { authHandlers } from './auth'
import { pagesHandlers } from './pages'
import { boardHandlers } from './board'

export const handlers = [...authHandlers, ...pagesHandlers, ...boardHandlers]