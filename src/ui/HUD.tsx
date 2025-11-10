import type { JSX } from 'preact'

import {
	Navigator,
	Settings,
	Inventory,
	ZoomControls,
	WidgetBar,
	Layout,
	CubeMenu,
	ColorMenu
} from './components'

import { useWidgetState } from './hooks'

type Widget = 'navigator' | 'settings' | 'inventory' | 'zoom' | 'layout'

const HUD = (): JSX.Element => {
	const { isOpen, getZIndex, bringToFront, toggle, close } = useWidgetState()

	const widgets: Array<{
		component: JSX.Element
		name: Widget
	}> = [
		{
			name: 'navigator',
			component: (
				<Navigator
					isOpen={isOpen('navigator')}
					zIndex={getZIndex('navigator')}
					onFocus={() => bringToFront('navigator')}
				/>
			)
		},
		{
			name: 'settings',
			component: (
				<Settings
					isOpen={isOpen('settings')}
					zIndex={getZIndex('settings')}
					onFocus={() => bringToFront('settings')}
				/>
			)
		},
		{
			name: 'inventory',
			component: (
				<Inventory
					isOpen={isOpen('inventory')}
					zIndex={getZIndex('inventory')}
					onFocus={() => bringToFront('inventory')}
				/>
			)
		},
		{
			name: 'zoom',
			component: (
				<ZoomControls
					isOpen={isOpen('zoom')}
					zIndex={getZIndex('zoom')}
					onFocus={() => bringToFront('zoom')}
				/>
			)
		},
		{
			name: 'layout',
			component: (
				<Layout
					isOpen={isOpen('layout')}
					zIndex={getZIndex('layout')}
					onFocus={() => bringToFront('layout')}
					onClose={() => close('layout')}
				/>
			)
		}
	]

	return (
		<div className="pointer-events-none fixed inset-0 z-50">
			{widgets.map(({ component }) => component)}

			<WidgetBar onToggle={toggle} />
			<CubeMenu />
			<ColorMenu />
		</div>
	)
}

export default HUD
