import type Tile from '../Tile'

import type { Point3D, FaceKey } from '@/core/utils'

import { selectedCube } from '@/ui/store/inventory'

export class TileEventHandlers {
	readonly #onPlaceCube: (position: Point3D, size: number) => void
	readonly #onTileClicked: (position: Point3D) => void

	constructor(
		onPlaceCube: (position: Point3D, size: number) => void,
		onTileClicked: (position: Point3D) => void
	) {
		this.#onPlaceCube = onPlaceCube
		this.#onTileClicked = onTileClicked
	}

	handleTileClick(position: Point3D): void {
		const selected = selectedCube.value

		if (selected) {
			this.#onPlaceCube(position, selected.size)
			return
		}

		this.#onTileClicked(position)
	}

	handleFaceRightClick(key: FaceKey, hexColor: number, tiles: Tile[]): void {
		const numericColor = parseInt(hexColor.toString().replace('#', ''), 16)

		for (const tile of tiles)
			tile.container?.faces.get(key)?.draw(numericColor)
	}
}
