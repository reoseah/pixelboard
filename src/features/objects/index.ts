import { SliceHandler } from './slice'
import type { ObjectHandler } from './types'

export type ObjectHandlers = Record<string, ObjectHandler>
export const ObjectHandlers: ObjectHandlers = {
	slice: SliceHandler,
}
export default ObjectHandlers
