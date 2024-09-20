import { makePersisted } from "@solid-primitives/storage";
import { Accessor, createContext, createRoot, createSignal } from "solid-js";
import { hexToRgb, rgbToHsv, rgbToHex, hsvToRgb, normalizeHex } from "../core/color_conversion";

export type CurrentColor = {
    hex: Accessor<string>,
    rgb: Accessor<[number, number, number]>,
    hsv: Accessor<[number, number, number]>,
    alpha: Accessor<number>,
    setHex: (hex: string) => void,
    setRgb: (rgb: [number, number, number]) => void,
    setHsv: (hsv: [number, number, number]) => void,
    setAlpha: (alpha: number) => void,
}

const CurrentColor: CurrentColor = createRoot(() => {
    const [hex, _setHex] = makePersisted(createSignal("#000000"), { name: "color" })
    const [rgb, _setRgb] = createSignal(hexToRgb(hex()))
    const [hsv, _setHsv] = createSignal(rgbToHsv(rgb()))
    const [alpha, setAlpha] = makePersisted(createSignal(1), { name: "alpha" })

    const setHex = (hex: string) => {
        _setHex(hex)
        hex = normalizeHex(hex)
        _setRgb(hexToRgb(hex))
        _setHsv(rgbToHsv(hexToRgb(hex)))
    }

    const setRgb = (rgb: [number, number, number]) => {
        _setRgb(rgb)
        _setHex(rgbToHex(rgb))
        _setHsv(rgbToHsv(rgb))
    }

    const setHsv = (hsv: [number, number, number]) => {
        _setHsv(hsv)
        _setRgb(hsvToRgb(hsv))
        _setHex(rgbToHex(hsvToRgb(hsv)))
    }

    return {
        hex, rgb, hsv, alpha,
        setHex, setRgb, setHsv, setAlpha
    }
})

export default CurrentColor

export const CurrentColorContext = createContext<CurrentColor>(CurrentColor)
