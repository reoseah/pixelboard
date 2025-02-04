import { createContext } from 'solid-js'
import { SliceHandler } from './slice'
import type { NonRasterHandler } from './types'

export const DefaultNonRasterHandlers = {
	slice: SliceHandler,
}

export const NonRasterHandlerRegistry = createContext<Record<string, NonRasterHandler>>(DefaultNonRasterHandlers)
