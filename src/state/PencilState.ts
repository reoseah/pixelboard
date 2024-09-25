import { makePersisted } from "@solid-primitives/storage";
import { createContext, createRoot, createSignal } from "solid-js";
import { BlendingMode } from "../core/blending_modes";

const PencilState = createRoot(() => {
    const [shape, setShape] = makePersisted(createSignal<'circle' | 'square'>('circle'), { name: 'pencil-shape' })
    const [size, setSize] = makePersisted(createSignal(1), { name: 'pencil-size' })
    const [mode, setMode] = makePersisted(createSignal<BlendingMode>('normal'), { name: 'pencil-mode' })

    return {
        shape,
        setShape,
        size,
        setSize,
        mode,
        setMode
    }
})

export default PencilState

export const PencilStateContext = createContext(PencilState)