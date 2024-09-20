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
    const [hex, _setHex] = makePersisted(createSignal("#FFFFFF"), { name: "color" })
    const [rgb, _setRgb] = createSignal(hexToRgb(hex()))
    const [hsv, _setHsv] = createSignal(rgbToHsv(rgb()))
    const [alpha, setAlpha] = makePersisted(createSignal(1), { name: "alpha" })

    const setHex = (hex: string) => {
        let safeHex = normalizeHex(hex)
        const hasAlpha = safeHex.length === 9
        if (hasAlpha) {
            setAlpha(parseInt(safeHex.slice(7, 9), 16) / 255)
            safeHex = safeHex.slice(0, 7)
            _setHex(safeHex)
        } else {
            _setHex(hex)
        }
        _setRgb(hexToRgb(safeHex))
        _setHsv(rgbToHsv(hexToRgb(safeHex)))
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
