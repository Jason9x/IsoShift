import { effect } from '@preact/signals'
import type { Viewport } from 'pixi-viewport'

import { zoom } from './store/zoom'

let viewport: Viewport | null = null

export const setViewport = (instance: Viewport) => {
	viewport = instance
	zoom.value = instance.scale.x

	instance.on('zoomed', () => (zoom.value = instance.scale.x))

	effect(() => {
		viewport?.setZoom(zoom.value, true)
	})
}
