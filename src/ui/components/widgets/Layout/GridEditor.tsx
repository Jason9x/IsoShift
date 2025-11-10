import type { JSX, TargetedMouseEvent } from 'preact'

type GridEditorProps = {
	grid: number[][]
	door?: { x: number; y: number; z: number }
	onTileClick: (
		event: TargetedMouseEvent<HTMLButtonElement>,
		x: number,
		y: number
	) => void
	onTileRightClick: (
		event: TargetedMouseEvent<HTMLButtonElement>,
		x: number,
		y: number
	) => void
	onExpand: (
		event: TargetedMouseEvent<HTMLButtonElement>,
		direction: 'right' | 'bottom'
	) => void
	onShrink: (
		event: TargetedMouseEvent<HTMLButtonElement>,
		direction: 'right' | 'bottom'
	) => void
}

const GridEditor = ({
	grid,
	door,
	onTileClick,
	onTileRightClick,
	onExpand,
	onShrink
}: GridEditorProps): JSX.Element => {
	const displayGrid = grid.length > 0 ? grid : [[0]]

	return (
		<div className="mb-3 flex gap-2">
			<div className="flex shrink-0 flex-col gap-1">
				<button
					onClick={e => onExpand(e, 'bottom')}
					className="rounded bg-gray-800 px-2 py-1 text-xs font-medium transition-all hover:bg-gray-700"
				>
					+ Row
				</button>

				<button
					onClick={event => onShrink(event, 'bottom')}
					className="rounded bg-gray-800 px-2 py-1 text-xs font-medium transition-all hover:bg-gray-700"
				>
					- Row
				</button>
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="h-40 min-w-0 overflow-auto rounded border border-gray-700/50 bg-gray-900/50 px-2 py-2">
					<div className="inline-flex w-max flex-col gap-1">
						{displayGrid.map((row, x) => (
							<div key={x} className="flex min-w-0 gap-1">
								{row.map((height, y) => {
									const isDoor =
										door?.x === x && door?.y === y

									return (
										<button
											key={`${x}-${y}`}
											type="button"
											onClick={e => onTileClick(e, x, y)}
											onContextMenu={e =>
												onTileRightClick(e, x, y)
											}
											className={`h-6 w-6 shrink-0 rounded text-xs font-bold transition-all ${
												isDoor
													? 'bg-green-600 text-white hover:bg-green-500'
													: height === -1
														? 'bg-gray-800 text-gray-600'
														: 'bg-gray-700 text-gray-200 hover:bg-gray-600'
											}`}
										>
											{height === -1 ? '✕' : height}
										</button>
									)
								})}
							</div>
						))}
					</div>
				</div>

				<div className="mt-1 flex w-full justify-end">
					<div className="flex items-center gap-1">
						<button
							onClick={e => onExpand(e, 'right')}
							className="rounded bg-gray-800 px-2 py-1 text-xs font-medium transition-all hover:bg-gray-700"
						>
							+ Col
						</button>

						<button
							onClick={e => onShrink(e, 'right')}
							className="rounded bg-gray-800 px-2 py-1 text-xs font-medium transition-all hover:bg-gray-700"
						>
							- Col
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default GridEditor
