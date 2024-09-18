import { Accessor, createContext, createRoot, createSignal } from "solid-js"
import { makePersisted } from "@solid-primitives/storage"
import { Registry } from "./Registry"

export type SelectedToolState = Accessor<string>

export type SelectedToolActions = (id: string) => void

export const SelectedTool: [
    state: SelectedToolState,
    actions: SelectedToolActions
] = createRoot(() => {
    const [id, setId] = makePersisted(createSignal("select"), { name: "selected-tool" })

    requestAnimationFrame(() => {
        const tool = Registry.tools[id()]
        if (tool?.onSelect) {
            tool.onSelect("select")
        }
    })
    
    const select = (targetId: string) => {
        const prevId = id()
        const prevTool = Registry.tools[prevId]
        if (prevTool?.onDeselect) {
            prevTool.onDeselect()
        }

        setId(targetId)

        const tool = Registry.tools[targetId]
        if (tool?.onSelect) {
            tool.onSelect(prevId)
        }
    }

    return [id, select]
})

export const SelectedToolContext = createContext(SelectedTool)