export const COLOR_PALETTE = [
  { key: 'red', label: 'Rojo', hex: '#DF3D3D' },
  { key: 'blue', label: 'Azul', hex: '#249DF9' },
  { key: 'pink', label: 'Rosa', hex: '#E26FE8' },
  { key: 'teal', label: 'Verde Azulado', hex: '#169395' },
  { key: 'coral', label: 'Coral', hex: '#FB7E55' },
  { key: 'yellow', label: 'Amarillo', hex: '#F0DB35' },
  { key: 'purple', label: 'Violeta', hex: '#6A2BB2' },
  { key: 'indigo', label: 'Índigo', hex: '#3535F0' },
] as const

export type ColorKey = (typeof COLOR_PALETTE)[number]['key']

export const COLOR_KEYS = COLOR_PALETTE.map((c) => c.key) as ColorKey[]

export function isColorKey(value: unknown): value is ColorKey {
  return typeof value === 'string' && (COLOR_KEYS as string[]).includes(value)
}

export function getColorLabel(key: ColorKey): string {
  return COLOR_PALETTE.find((c) => c.key === key)?.label ?? key
}

export function getColorHex(key: ColorKey): string {
  return COLOR_PALETTE.find((c) => c.key === key)?.hex ?? '#000000'
}
