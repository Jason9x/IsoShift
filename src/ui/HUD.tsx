import { useState } from 'preact/hooks'
import {
	Navigator,
	Settings,
	Inventory,
	ZoomControls,
	WidgetBar,
	Layout,
} from './components'

type Widget = 'navigator' | 'settings' | 'inventory' | 'zoom' | 'layout'

const HUD = () => {
	const [openWidget, setOpenWidget] = useState<Widget | null>(null)
	const toggle = (widget: Widget) =>
		setOpenWidget(previousWidget =>
			previousWidget === widget ? null : widget,
		)
	const close = () => setOpenWidget(null)

	return (
		<div className="pointer-events-none fixed inset-0 z-50">
			<Navigator isOpen={openWidget === 'navigator'} />
			<Settings isOpen={openWidget === 'settings'} onClose={close} />
			<Inventory isOpen={openWidget === 'inventory'} />
			<ZoomControls isOpen={openWidget === 'zoom'} />
			<Layout isOpen={openWidget === 'layout'} onClose={close} />
			<WidgetBar onToggle={toggle} />
		</div>
	)
}

export default HUD
