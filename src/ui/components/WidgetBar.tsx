type Widget = 'navigator' | 'settings' | 'inventory' | 'zoom' | 'layout'

type WidgetBarProps = {
	onToggle: (widget: Widget) => void
}

const WidgetBar = ({ onToggle }: WidgetBarProps) => {
	return (
		<div className="pointer-events-auto absolute left-1/2 top-4 flex -translate-x-1/2 gap-1.5 rounded-lg border border-gray-800/50 bg-gray-950/85 px-2 py-1 shadow-2xl backdrop-blur-md">
			<button
				onClick={() => onToggle('navigator')}
				className="flex h-7 w-7 items-center justify-center rounded text-base text-gray-200 transition-all hover:bg-gray-800/50"
				title="Navigator"
			>
				🧭
			</button>

			<button
				onClick={() => onToggle('settings')}
				className="flex h-7 w-7 items-center justify-center rounded text-base text-gray-200 transition-all hover:bg-gray-800/50"
				title="Settings"
			>
				⚙️
			</button>

			<button
				onClick={() => onToggle('inventory')}
				className="flex h-7 w-7 items-center justify-center rounded text-base text-gray-200 transition-all hover:bg-gray-800/50"
				title="Inventory"
			>
				🎒
			</button>

			<button
				onClick={() => onToggle('zoom')}
				className="flex h-7 w-7 items-center justify-center rounded text-base text-gray-200 transition-all hover:bg-gray-800/50"
				title="Zoom"
			>
				🔍
			</button>

			<button
				onClick={() => onToggle('layout')}
				className="flex h-7 w-7 items-center justify-center rounded text-base text-gray-200 transition-all hover:bg-gray-800/50"
				title="Layout"
			>
				🏗️
			</button>
		</div>
	)
}

export default WidgetBar
