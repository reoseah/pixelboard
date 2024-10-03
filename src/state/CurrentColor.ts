import { makePersisted } from '@solid-primitives/storage'
import { createSignal } from 'solid-js'

import { hexToRgb, hsvToRgb, normalizeHex, rgbToHex, rgbToHsv } from '../util/color_conversion'

const [hex, _setHex] = makePersisted(createSignal('#FFFFFF'), { name: 'color' })
const [rgb, _setRgb] = createSignal(hexToRgb(hex()))
const [hsv, _setHsv] = createSignal(rgbToHsv(rgb()))
const [alpha, setAlpha] = makePersisted(createSignal(1), { name: 'alpha' })

const setHex = (hex: string) => {
  const hasAlpha = hex.length > 7
  let safeHex = normalizeHex(hex)
  if (hasAlpha) {
    setAlpha(parseInt(safeHex.slice(7, 9), 16) / 255)
    safeHex = safeHex.slice(0, 7)
    _setHex(safeHex)
  }
  else {
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

export default {
  alpha,
  hex,
  hsv,
  rgb,
  setAlpha,
  setHex,
  setHsv,
  setRgb,
}
