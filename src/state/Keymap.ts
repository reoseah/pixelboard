export type KeyCombination = {
    key: string
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    meta?: boolean
}

export const parseKeybind = (keybind: string): KeyCombination => {
    const keys = keybind.split("+")
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

export const stringifyKeybind = (keybind: KeyCombination): string => {
    return `${keybind.ctrl ? "Ctrl+" : ""}${keybind.shift ? "Shift+" : ""}${keybind.alt ? "Alt+" : ""}${keybind.meta ? "Meta+" : ""}${keybind.key}`
}

export type Keybinding = {
    command: string
    key: KeyCombination
    mac?: KeyCombination
    linux?: KeyCombination
    win?: KeyCombination
}

const DefaultKeymap: Keybinding[] = [
    {
        command: "select_tool.select",
        key: parseKeybind("V")
    },
    {
        command: "select_tool.pencil",
        key: parseKeybind("P")
    },
    {
        command: "select_tool.select_rectangle",
        key: parseKeybind("R")
    },
    {
        command: "select_tool.crop",
        key: parseKeybind("C")
    },
    {
        command: "select_tool.command_palette",
        key: parseKeybind("Ctrl+K")
    },

    {
        command: "toggle_sidebar",
        key: parseKeybind("Ctrl+B")
    },
    {
        command: "toggle_tab.menu",
        key: parseKeybind("Alt+M")
    },
    {
        command: "toggle_tab.color",
        key: parseKeybind("Alt+C")
    },
    {
        command: "toggle_tab.settings",
        key: parseKeybind("Alt+S")
    },

    {
        command: "deselect",
        key: parseKeybind("Ctrl+D")
    },
    {
        command: "reselect",
        key: parseKeybind("Ctrl+Shift+D")
    }
]

export default DefaultKeymap