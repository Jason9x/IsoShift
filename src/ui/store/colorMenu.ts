import { signal } from '@preact/signals'

type ColorMenuState = {
	x: number
	y: number
	type: 'cube' | 'avatar' | 'tile'
	entityId: string
	faceKey: string
	onColorChange: (color: number) => void
} | null

export const colorMenuState = signal<ColorMenuState>(null)
