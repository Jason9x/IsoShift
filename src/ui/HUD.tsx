import type { JSX } from 'preact/jsx-runtime'

import {
	Navigator,
	Settings,
	Inventory,
	ZoomControls,
	WidgetBar,
	Layout,
	CubeMenu,
} from './components'

import { useWidgetState } from './hooks'

const HUD = (): JSX.Element => {
	const { openWidget, toggle, close } = useWidgetState()

	return (
		<div className="pointer-events-none fixed inset-0 z-50">
			<Navigator isOpen={openWidget === 'navigator'} />
			<Settings isOpen={openWidget === 'settings'} onClose={close} />
			<Inventory isOpen={openWidget === 'inventory'} />
			<ZoomControls isOpen={openWidget === 'zoom'} />
			<Layout isOpen={openWidget === 'layout'} onClose={close} />

			<WidgetBar onToggle={toggle} />
			<CubeMenu />
		</div>
	)
}

export default HUD
