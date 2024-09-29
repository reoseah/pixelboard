import { Accessor, createContext, createRoot, createSignal, onCleanup } from "solid-js"
import { makePersisted } from "@solid-primitives/storage"
import Registry from "./Registry"

export type CurrentTool = {
    id: Accessor<string>,
    selectId: (id: string) => void,
    prevId: Accessor<string>
}

export const CurrentTool: CurrentTool = createRoot(() => {
    const [id, setId] = makePersisted(createSignal("select"), { name: "selected-tool" })
    const [prevId, setPrevId] = createSignal("select")

    if (id() === "command_palette") {
        setId("select")
    }

    const selectId = (targetId: string) => {
        const prevId = id()
        if (prevId === targetId) {
            return
        }

        setId(targetId)
        setPrevId(prevId)
    }

    return { id, selectId, prevId }
})

export const CurrentToolContext = createContext(CurrentTool)