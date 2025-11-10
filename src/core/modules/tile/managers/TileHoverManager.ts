import { selectedCube } from '@/ui/store/inventory'

import Tile from '../Tile'

export class TileHoverManager {
	readonly #onShowBlueprintAndDisableCubes: (
		position: { x: number; y: number; z: number },
		size: number
	) => void
	readonly #onHideBlueprintAndEnableCubes: () => void

	#hoveredTile?: Tile

	constructor(
		onHideBlueprint: () => void,
		onShowBlueprint: (
			position: { x: number; y: number; z: number },
			size: number
		) => void,
		onEnableCubes: () => void,
		onDisableCubes: () => void
	) {
		this.#onShowBlueprintAndDisableCubes = (
			position: { x: number; y: number; z: number },
			size: number
		) => {
			onShowBlueprint(position, size)
			onDisableCubes()
		}

		this.#onHideBlueprintAndEnableCubes = () => {
			onHideBlueprint()
			onEnableCubes()
		}
	}

	setHoveredTile(tile: Tile | undefined): void {
		if (this.#hoveredTile === tile) return

		this.clearHover()

		if (!tile) return

		this.#hoveredTile = tile
		tile.container.createHoverEffect()

		if (!selectedCube.value) return

		this.#onShowBlueprintAndDisableCubes(
			tile.position,
			selectedCube.value.size
		)
	}

	clearHover(): void {
		if (!this.#hoveredTile) return

		this.#hoveredTile.container.destroyHoverEffect()
		this.#hoveredTile = undefined
		this.#onHideBlueprintAndEnableCubes()
	}
}
