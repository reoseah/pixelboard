import { createContext } from 'solid-js'

import { KeyShortcut, parseShortcut } from '../types/key_shortcut'

export type Keybinding = {
  command: string
  key: KeyShortcut
  linux?: KeyShortcut
  mac?: KeyShortcut
  win?: KeyShortcut
}

const DefaultKeymap: Keybinding[] = [
  {
    command: 'select_tool.select',
    key: parseShortcut('V'),
  },
  {
    command: 'select_tool.pencil',
    key: parseShortcut('B'),
  },
  {
    command: 'select_tool.select_rectangle',
    key: parseShortcut('M'),
  },
  {
    command: 'select_tool.frame',
    key: parseShortcut('F'),
  },
  {
    command: 'select_tool.command_palette',
    key: parseShortcut('Ctrl+K'),
  },

  {
    command: 'toggle_sidebar',
    key: parseShortcut('Ctrl+B'),
  },
  {
    command: 'toggle_tab.menu',
    key: parseShortcut('Alt+M'),
  },
  {
    command: 'toggle_tab.color',
    key: parseShortcut('Alt+C'),
  },
  {
    command: 'toggle_tab.collaboration',
    key: parseShortcut('Alt+O'),
  },
  {
    command: 'toggle_tab.settings',
    key: parseShortcut('Alt+S'),
  },

  {
    command: 'deselect',
    key: parseShortcut('Ctrl+D'),
  },
  {
    command: 'reselect',
    key: parseShortcut('Ctrl+Shift+D'),
  },
  {
    command: 'delete_selection',
    key: parseShortcut('Delete'),
  },
]

const KeymapContext = createContext(DefaultKeymap)

export default KeymapContext
