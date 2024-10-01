export const normalizeHex = (color: string): string => {
  if (color.startsWith('rgb')) {
    const [r, g, b] = color.match(/\d+/g)!.map(Number)
    return r.toString(16).padStart(2, '0')
      + g.toString(16).padStart(2, '0')
      + b.toString(16).padStart(2, '0')
  }
  color = color.replace(/^#/, '')
  if (color.length < 6) {
    color = color.split('').map(char => char + char).join('')
  }
  return '#' + color.toUpperCase()
}

export const hexToRgb = (hex: string): [number, number, number] => {
  if (hex.startsWith('#')) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }

  const r = parseInt(hex.slice(0, 2), 16) || 0
  const g = parseInt(hex.slice(2, 4), 16) || 0
  const b = parseInt(hex.slice(4, 6), 16) || 0
  return [r, g, b]
}

export const rgbToHex = (rgb: [number, number, number]) => {
  return `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`
}

export const rgbToHsv = (rgb: [number, number, number]): [number, number, number] => {
  const r = rgb[0] / 255
  const g = rgb[1] / 255
  const b = rgb[2] / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6)
    }
    else if (max === g) {
      h = 60 * ((b - r) / delta + 2)
    }
    else if (max === b) {
      h = 60 * ((r - g) / delta + 4)
    }
  }

  const s = max === 0 ? 0 : delta / max
  const v = max

  return [(h + 360) % 360, s * 100, v * 100]
}

export const hsvToRgb = (hsv: [number, number, number]): [number, number, number] => {
  const h = hsv[0] / 360
  const s = hsv[1] / 100
  const v = hsv[2] / 100

  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  let b!: number, g!: number, r!: number
  switch (i % 6) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }
  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ]
}
