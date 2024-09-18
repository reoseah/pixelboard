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

const defaultToolKeymap: Record<string, string> = {
    select: "V",
    pencil: "P",
    select_rectangle: "R",
    command_palette: "Ctrl+K"
}

const DefaultKeymap: Keybinding[] = [
    ...Object.entries(defaultToolKeymap).map(([tool, key]) => ({
        command: `select_tool.${tool}`,
        key: parseKeybind(key)
    }))
]

export default DefaultKeymap