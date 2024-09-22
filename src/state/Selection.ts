import { makePersisted } from "@solid-primitives/storage"
import { Accessor, createContext, createRoot } from "solid-js"
import { createStore, reconcile, Store, unwrap } from "solid-js/store"

export type SelectionState = {
    parts: Store<SelectionPart[]>,
    prevParts: () => SelectionPart[] | []
}

export type SelectionPart =
    | { type: "rectangle", x: number, y: number, width: number, height: number }

export type SelectionMode =
    | "replace"

export type SelectionActions = {
    getBounds: Accessor<{ x: number, y: number, width: number, height: number }>

    deselect: () => void
    reselect: () => void
    selectRectangle: (mode: SelectionMode, x: number, y: number, width: number, height: number) => void
}

const Selection: [
    state: SelectionState,
    actions: SelectionActions
] = createRoot(() => {
    const store = createStore<SelectionPart[]>([])
    const [parts, setParts] = makePersisted(store, { name: "selection-parts" })

    const getBounds = () => {
        const [minX, minY, maxX, maxY] = parts.reduce((bounds, part) => {
            if (part.type === "rectangle") {
                return [
                    Math.min(bounds[0], part.x),
                    Math.min(bounds[1], part.y),
                    Math.max(bounds[2], part.x + part.width),
                    Math.max(bounds[3], part.y + part.height)
                ]
            }
            return bounds
        }, [Infinity, Infinity, -Infinity, -Infinity])

        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
    }

    let prevParts: SelectionPart[] = []
    const deselect = () => {
        prevParts = JSON.parse(JSON.stringify(store[0]))
        setParts(reconcile([]))
    }

    const reselect = () => {
        if (prevParts.length === 0) {
            return
        }
        setParts(reconcile(prevParts))
    }

    const selectRectangle = (mode: SelectionMode, x: number, y: number, width: number, height: number) => {
        if (mode === "replace") {
            if (width === 0 || height === 0) {
                setParts(reconcile([]))
                return
            }
            setParts(reconcile([{ type: "rectangle", x, y, width, height }]))
        }
    }

    return [
        {
            parts,
            prevParts: () => prevParts
        },
        {
            getBounds,
            deselect,
            reselect,
            selectRectangle
        }
    ]
})

export default Selection

export const SelectionContext = createContext(Selection)