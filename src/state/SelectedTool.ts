import { createContext, createRoot, createSignal } from "solid-js"
import { makePersisted } from "@solid-primitives/storage"
import { Registry } from "./Registry"

export type SelectedToolState = () => string

export type SelectedToolActions = (id: string) => void

export const SelectedTool: [
    state: SelectedToolState,
    actions: SelectedToolActions
] = createRoot(() => {
    const [id, setId] = makePersisted(createSignal("select"), { name: "selected-tool" })

    const select = (targetId: string) => {
        const prev = Registry.tools[id()]
        if (prev?.onDeselect) {
            prev.onDeselect()
        }

        setId(targetId)

        const tool = Registry.tools[targetId]
        if (tool?.onSelect) {
            tool.onSelect()
        }
    }

    return [id, select]
})

export const SelectedToolContext = createContext(SelectedTool)