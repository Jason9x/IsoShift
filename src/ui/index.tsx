import { render } from 'preact'
import HUD from './HUD'

export const initializeUI = (): void => {
	const uiRoot = document.getElementById('ui-root')

	if (uiRoot) render(<HUD />, uiRoot)
}

export * from './store'
export * from './viewport'
