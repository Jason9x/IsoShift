import type { JSX } from 'preact'

type ActionButtonsProps = {
	onReset: () => void
	onClose: () => void
	onSave: () => void
}

const ActionButtons = ({
	onReset,
	onClose,
	onSave
}: ActionButtonsProps): JSX.Element => (
	<div className="mt-3 border-t border-gray-800/50 bg-gray-950/90 px-3 py-2">
		<div className="flex gap-1">
			<button
				onClick={onReset}
				className="flex-1 rounded-md bg-red-600/90 px-2 py-1.5 text-xs font-medium transition-all hover:bg-red-600"
			>
				Reset
			</button>

			<button
				onClick={onClose}
				className="flex-1 rounded-md bg-gray-800 px-2 py-1.5 text-xs font-medium transition-all hover:bg-gray-700"
			>
				Close
			</button>

			<button
				onClick={onSave}
				className="flex-1 rounded-md bg-blue-600/90 px-2 py-1.5 text-xs font-medium transition-all hover:bg-blue-600"
			>
				Apply
			</button>
		</div>
	</div>
)

export default ActionButtons
