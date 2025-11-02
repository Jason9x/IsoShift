import { signal } from '@preact/signals'

export const zoom = signal(1.0)

export const updateZoom = (value: number) => (zoom.value = value)
