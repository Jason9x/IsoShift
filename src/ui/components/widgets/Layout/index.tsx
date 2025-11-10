import { useRef } from 'preact/hooks'
import type { JSX } from 'preact'

import { useDraggable } from '@/ui/hooks'
import NumberInput from './NumberInput'
import DoorControls from './DoorControls'
import GridEditor from './GridEditor'
import ActionButtons from './ActionButtons'
import { useLayoutState } from './useLayoutState'
import { MAX_THICKNESS } from './constants'
import type { TargetedMouseEvent } from 'preact'

type LayoutProps = {
	isOpen: boolean
	zIndex: number
	onFocus: () => void
	onClose: () => void
}

const Layout = ({
	isOpen,
	zIndex,
	onFocus,
	onClose
}: LayoutProps): JSX.Element | null => {
	const ref = useRef<HTMLDivElement>(null)
	const wallHeightInputRef = useRef<HTMLInputElement>(null)
	const wallThicknessInputRef = useRef<HTMLInputElement>(null)
	const tileThicknessInputRef = useRef<HTMLInputElement>(null)

	const { handleProps } = useDraggable({ elementRef: ref })

	const {
		draftGrid,
		draftWallHeight,
		draftWallThickness,
		draftTileThickness,
		draftDoor,
		isDoorMode,
		setDraftWallHeight,
		setDraftWallThickness,
		setDraftTileThickness,
		setDraftDoor,
		setIsDoorMode,
		handleSave,
		handleReset,
		handleExpand,
		handleShrink,
		handleTileClick,
		handleTileRightClick
	} = useLayoutState()

	if (!isOpen) return null

	const onSave = () =>
		handleSave(
			wallHeightInputRef.current,
			wallThicknessInputRef.current,
			tileThicknessInputRef.current
		)

	const onTileClick = (
		event: TargetedMouseEvent<HTMLButtonElement>,
		x: number,
		y: number
	) => {
		event.stopPropagation()
		handleTileClick(x, y)
	}

	const onTileRightClick = (
		event: TargetedMouseEvent<HTMLButtonElement>,
		x: number,
		y: number
	) => {
		event.preventDefault()
		event.stopPropagation()
		handleTileRightClick(x, y)
	}

	const onExpand = (
		event: TargetedMouseEvent<HTMLButtonElement>,
		direction: 'right' | 'bottom'
	) => {
		event.stopPropagation()
		handleExpand(direction)
	}

	const onShrink = (
		event: TargetedMouseEvent<HTMLButtonElement>,
		direction: 'right' | 'bottom'
	) => {
		event.stopPropagation()
		handleShrink(direction)
	}

	return (
		<div
			ref={ref}
			{...handleProps}
			onMouseDown={onFocus}
			style={{ zIndex }}
			className="pointer-events-auto fixed right-5 top-5 flex max-h-[88vh] w-64 cursor-grab flex-col rounded-lg border border-gray-800/50 bg-gray-950/90 text-gray-200 shadow-2xl backdrop-blur-md active:cursor-grabbing"
		>
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
				<div className="flex min-h-0 flex-1 flex-col p-3">
					<h2 className="mb-3 text-sm font-bold">Floor Layout</h2>

					<div className="mb-3 space-y-3">
						<div className="grid grid-cols-2 gap-2">
							<NumberInput
								label="Wall Height"
								value={draftWallHeight}
								inputRef={wallHeightInputRef}
								onChange={setDraftWallHeight}
							/>

							<NumberInput
								label="Wall Thick"
								value={draftWallThickness}
								max={MAX_THICKNESS}
								inputRef={wallThicknessInputRef}
								onChange={setDraftWallThickness}
							/>
						</div>

						<NumberInput
							label="Tile Thickness"
							value={draftTileThickness}
							max={MAX_THICKNESS}
							inputRef={tileThicknessInputRef}
							onChange={setDraftTileThickness}
						/>

						<DoorControls
							isDoorMode={isDoorMode}
							onToggleDoorMode={() => setIsDoorMode(!isDoorMode)}
							onClearDoor={() => setDraftDoor(undefined)}
							door={draftDoor}
						/>
					</div>

					<div className="mb-3 rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-400">
						{isDoorMode
							? 'Click a tile to set door'
							: 'Click: +1 | Right-click: -1'}
					</div>

					<GridEditor
						grid={draftGrid}
						door={draftDoor}
						onTileClick={onTileClick}
						onTileRightClick={onTileRightClick}
						onExpand={onExpand}
						onShrink={onShrink}
					/>
				</div>

				<ActionButtons
					onReset={handleReset}
					onClose={onClose}
					onSave={onSave}
				/>
			</div>
		</div>
	)
}

export default Layout
