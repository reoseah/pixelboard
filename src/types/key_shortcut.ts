export type KeyShortcut = {
  alt?: boolean
  ctrl?: boolean
  key: string
  meta?: boolean
  shift?: boolean
}

export const parseShortcut = (shortcut: string): KeyShortcut => {
  const keys = shortcut.split('+')
  const key = keys.pop()!
  const modifiers = keys.map(key => key.toLowerCase())
  return {
    alt: modifiers.includes('alt'),
    ctrl: modifiers.includes('ctrl'),
    key,
    meta: modifiers.includes('meta'),
    shift: modifiers.includes('shift'),
  }
}

export const stringifyShortcut = (shortcut: KeyShortcut): string => {
  return `${shortcut.ctrl ? 'Ctrl+' : ''}${shortcut.shift ? 'Shift+' : ''}${shortcut.alt ? 'Alt+' : ''}${shortcut.meta ? 'Meta+' : ''}${shortcut.key}`
}
