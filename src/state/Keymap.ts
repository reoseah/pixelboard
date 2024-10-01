export type KeyShortcut = {
    key: string
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    meta?: boolean
}

export const parseShortcut = (shortcut: string): KeyShortcut => {
    const keys = shortcut.split("+")
    const key = keys.pop()!
    const modifiers = keys.map(key => key.toLowerCase())
    return {
        key,
        ctrl: modifiers.includes("ctrl"),
        shift: modifiers.includes("shift"),
        alt: modifiers.includes("alt"),
        meta: modifiers.includes("meta")
    }
}

export const stringifyShortcut = (shortcut: KeyShortcut): string => {
    return `${shortcut.ctrl ? "Ctrl+" : ""}${shortcut.shift ? "Shift+" : ""}${shortcut.alt ? "Alt+" : ""}${shortcut.meta ? "Meta+" : ""}${shortcut.key}`
}

export type Keybinding = {
    command: string
    key: KeyShortcut
    mac?: KeyShortcut
    linux?: KeyShortcut
    win?: KeyShortcut
}

const DefaultKeymap: Keybinding[] = [
    {
        command: "select_tool.select",
        key: parseShortcut("V")
    },
    {
        command: "select_tool.pencil",
        key: parseShortcut("P")
    },
    {
        command: "select_tool.select_rectangle",
        key: parseShortcut("M")
    },
    {
        command: "select_tool.crop",
        key: parseShortcut("C")
    },
    {
        command: "select_tool.command_palette",
        key: parseShortcut("Ctrl+K")
    },

    {
        command: "toggle_sidebar",
        key: parseShortcut("Ctrl+B")
    },
    {
        command: "toggle_tab.menu",
        key: parseShortcut("Alt+M")
    },
    {
        command: "toggle_tab.color",
        key: parseShortcut("Alt+C")
    },
    {
        command: "toggle_tab.collaboration",
        key: parseShortcut("Alt+O")
    },
    {
        command: "toggle_tab.settings",
        key: parseShortcut("Alt+S")
    },

    {
        command: "deselect",
        key: parseShortcut("Ctrl+D")
    },
    {
        command: "reselect",
        key: parseShortcut("Ctrl+Shift+D")
    },
    {
        command: "delete_selection",
        key: parseShortcut("Delete")
    }
]

export default DefaultKeymap