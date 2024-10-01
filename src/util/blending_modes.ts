export type BlendingMode = keyof typeof modeNames

export const modeNames = {
  darker: 'Darker',
  lighter: 'Lighter',
  multiply: 'Multiply',
  normal: 'Normal',
  screen: 'Screen',
} as const

export const modeGroups = [
  ['normal'],
  ['darker', 'multiply'],
  ['lighter', 'screen'],
] as const
