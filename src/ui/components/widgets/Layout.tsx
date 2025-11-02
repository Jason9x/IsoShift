import { useState } from 'preact/hooks'
import { grid, wallHeight, wallThickness } from '@/ui/store/grid'

const Layout = ({
	isOpen,
	onClose,
}: {
	isOpen: boolean
	onClose: () => void
}) => {
	const [tempGrid, setTempGrid] = useState(grid.value)
	const [tempWallHeight, setTempWallHeight] = useState(wallHeight.value)
	const [tempWallThickness, setTempWallThickness] = useState(
		wallThickness.value,
	)

	if (!isOpen) return null

	if (tempGrid !== grid.value) {
		setTempGrid(grid.value)
		setTempWallHeight(wallHeight.value)
		setTempWallThickness(wallThickness.value)
	}

	const handleTileClick = (x: number, y: number) => {
		const current = tempGrid[x][y]
		const newGrid = tempGrid.map(row => [...row])
		newGrid[x][y] = current === -1 ? 0 : current + 1
		setTempGrid(newGrid)
	}

	const handleTileRightClick = (e: MouseEvent, x: number, y: number) => {
		e.preventDefault()
		const current = tempGrid[x][y]
		const newGrid = tempGrid.map(row => [...row])
		newGrid[x][y] = current <= 0 ? -1 : current - 1
		setTempGrid(newGrid)
	}

	const handleSave = () => {
		grid.value = tempGrid
		wallHeight.value = tempWallHeight
		wallThickness.value = tempWallThickness
		onClose()
	}

	const handleReset = () => {
		setTempGrid(grid.value)
		setTempWallHeight(wallHeight.value)
		setTempWallThickness(wallThickness.value)
	}

	const handleExpand = (dir: 'right' | 'bottom') => {
		if (dir === 'right') setTempGrid(tempGrid.map(row => [...row, 0]))
		else setTempGrid([...tempGrid, Array(tempGrid[0].length).fill(0)])
	}

	const handleShrink = (dir: 'right' | 'bottom') => {
		if (dir === 'right' && tempGrid[0].length > 1)
			setTempGrid(tempGrid.map(row => row.slice(0, -1)))
		else if (dir === 'bottom' && tempGrid.length > 1)
			setTempGrid(tempGrid.slice(0, -1))
	}

	return (
		<div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="max-w-fit rounded-lg border border-gray-800/50 bg-gray-950/95 p-6 shadow-2xl backdrop-blur-md">
				<h2 className="mb-4 text-lg font-bold text-gray-200">
					Floor Layout
				</h2>

				<div className="mb-4 flex gap-4">
					<label className="flex items-center gap-2 text-sm text-gray-300">
						Wall Height:
						<input
							type="number"
							min="1"
							max="10"
							value={tempWallHeight}
							onChange={e =>
								setTempWallHeight(+e.currentTarget.value)
							}
							className="w-16 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-gray-200"
						/>
					</label>
					<label className="flex items-center gap-2 text-sm text-gray-300">
						Wall Thickness:
						<input
							type="number"
							min="1"
							max="5"
							value={tempWallThickness}
							onChange={e =>
								setTempWallThickness(+e.currentTarget.value)
							}
							className="w-16 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-gray-200"
						/>
					</label>
				</div>

				<div className="mb-3 text-xs text-gray-400">
					Click: +1 | Right-click: -1
				</div>

				<div className="mb-4 flex gap-3">
					<div className="flex flex-col justify-center gap-2">
						<button
							onClick={() => handleExpand('bottom')}
							className="rounded bg-gray-800 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-700"
						>
							+ Row
						</button>
						<button
							onClick={() => handleShrink('bottom')}
							className="rounded bg-gray-800 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-700"
						>
							- Row
						</button>
					</div>

					<div className="flex flex-col gap-2">
						<div className="grid gap-1">
							{tempGrid.map((row, x) => (
								<div key={x} className="flex gap-1">
									{row.map((height, y) => (
										<button
											key={`${x}-${y}`}
											onClick={() =>
												handleTileClick(x, y)
											}
											onContextMenu={e =>
												handleTileRightClick(e, x, y)
											}
											className={`h-10 w-10 rounded text-sm font-bold transition-all ${height === -1 ? 'bg-gray-800 text-gray-600' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
										>
											{height === -1 ? '✕' : height}
										</button>
									))}
								</div>
							))}
						</div>
						<div className="flex justify-center gap-2">
							<button
								onClick={() => handleExpand('right')}
								className="rounded bg-gray-800 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-700"
							>
								+ Col
							</button>
							<button
								onClick={() => handleShrink('right')}
								className="rounded bg-gray-800 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-700"
							>
								- Col
							</button>
						</div>
					</div>
				</div>

				<div className="flex gap-2">
					<button
						onClick={handleReset}
						className="flex-1 rounded bg-red-900/50 px-4 py-2 text-sm text-gray-200 transition-all hover:bg-red-800/50"
					>
						Reset
					</button>
					<button
						onClick={onClose}
						className="flex-1 rounded bg-gray-800 px-4 py-2 text-sm text-gray-200 transition-all hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="flex-1 rounded bg-blue-900/50 px-4 py-2 text-sm text-gray-200 transition-all hover:bg-blue-800/50"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	)
}

export default Layout
