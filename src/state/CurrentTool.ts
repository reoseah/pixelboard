import { Accessor, createContext, createRoot, createSignal } from "solid-js"
import { makePersisted } from "@solid-primitives/storage"
import Registry from "./Registry"

export type CurrentTool = {
    id: Accessor<string>,
    selectId: (id: string) => void
}

export const CurrentTool: CurrentTool = createRoot(() => {
    const [id, setId] = makePersisted(createSignal("select"), { name: "selected-tool" })

    requestAnimationFrame(() => {
        const tool = Registry.tools[id()]
        if (tool?.onSelect) {
            tool.onSelect("select")
        }
    })

    const selectId = (targetId: string) => {
        const prevId = id()
        if (prevId === targetId) {
            return
        }
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

    return { id, selectId }
})

export const CurrentToolContext = createContext(CurrentTool)