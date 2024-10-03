export type Keybind = {
  alt?: boolean
  ctrl?: boolean
  key: string
  meta?: boolean
  shift?: boolean
}

export const parseShortcut = (keybind: string): Keybind => {
  const keys = keybind.split('+')
  const key = keys.pop()!
  const modifiers = keys.map(key => key.toLowerCase())
  return {
    key,
    ctrl: modifiers.includes('ctrl'),
    shift: modifiers.includes('shift'),
    alt: modifiers.includes('alt'),
    meta: modifiers.includes('meta'),
  }
}

export const stringifyShortcut = (keybind: Keybind): string => {
  return `${keybind.ctrl ? 'Ctrl+' : ''}${keybind.shift ? 'Shift+' : ''}${keybind.alt ? 'Alt+' : ''}${keybind.meta ? 'Meta+' : ''}${keybind.key}`
}
