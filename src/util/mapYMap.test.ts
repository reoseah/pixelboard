import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import * as Y from 'yjs'
import { createRoot, onCleanup } from 'solid-js'
import { mapYMap } from './mapYMap'

describe('mapYMap', () => {
	let ydoc: Y.Doc
	let ymap: Y.Map<number>

	beforeEach(() => {
		ydoc = new Y.Doc()
		ymap = ydoc.getMap<number>('test')
	})

	afterEach(() => {
		ydoc.destroy()
	})

	test('initially maps all keys from Y.Map', () => {
		createRoot(() => {
			ymap.set('a', 1)
			ymap.set('b', 2)

			const mapped = mapYMap(ymap, (value, key) => ({ key, value }))

			expect(mapped).toEqual({
				a: { key: 'a', value: 1 },
				b: { key: 'b', value: 2 },
			})
		})
	})

	test('maps new keys when inserted', () => {
		createRoot(() => {
			const mapped = mapYMap(ymap, (value, key) => ({ key, value }))
			expect(mapped).toEqual({})

			ymap.set('x', 42)
			expect(mapped).toHaveProperty('x', { key: 'x', value: 42 })
		})
	})

	test('updates mapped values when an entry is modified', () => {
		createRoot(() => {
			ymap.set('c', 10)
			const mapped = mapYMap(ymap, (key, value) => ({ value, key }))

			expect(mapped.c).toEqual({ key: 'c', value: 10 })

			ymap.set('c', 20)
			expect(mapped.c).toEqual({ key: 'c', value: 20 })
		})
	})

	test('removes mapped values when deleted', () => {
		createRoot(() => {
			ymap.set('d', 99)
			const mapped = mapYMap(ymap, (value, key) => ({ key, value }))
			expect(mapped).toHaveProperty('d', { key: 'd', value: 99 })

			ymap.delete('d')
			expect(mapped).not.toHaveProperty('d')
		})
	})

	test('calls cleanup function when a key is removed', () => {
		const cleanupFn = vi.fn()

		createRoot(() => {
			const mapped = mapYMap(ymap, (value, key) => {
				onCleanup(cleanupFn)
				return { key, value }
			})

			ymap.set('e', 50)
			ymap.delete('e')

			expect(cleanupFn).toHaveBeenCalled()
		})
	})

	test('calls cleanup function when a key is updated', () => {
		const cleanupFn = vi.fn()

		createRoot(() => {
			const mapped = mapYMap(ymap, (value, key) => {
				onCleanup(cleanupFn)
				return { key, value }
			})

			ymap.set('f', 77)
			ymap.set('f', 88)

			expect(cleanupFn).toHaveBeenCalled()
		})
	})

	test('cleans up all mappings on component unmount', () => {
		const cleanupFn = vi.fn()

		const dispose = createRoot((dispose) => {
			const mapped = mapYMap(ymap, (value, key) => {
				onCleanup(cleanupFn)
				return { key, value }
			})

			ymap.set('g', 123)
			ymap.set('h', 456)

			return dispose
		})

		dispose() // Simulate component unmount
		expect(cleanupFn).toHaveBeenCalledTimes(2) // Two keys, two disposals
	})
})
