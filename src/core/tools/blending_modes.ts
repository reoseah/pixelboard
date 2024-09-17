export type BlendingMode = keyof typeof modeNames

export const modeNames = {
    normal: 'Normal',
    darker: 'Darker',
    multiply: 'Multiply',
    lighter: 'Lighter',
    screen: 'Screen',
} as const

export const modeGroups = [
    ['normal'],
    ['darker', 'multiply'],
    ['lighter', 'screen'],
] as const