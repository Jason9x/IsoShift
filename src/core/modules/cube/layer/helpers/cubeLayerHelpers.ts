import type { Container } from 'pixi.js'

import type { CubeData } from '@/ui/store/rooms'

import type {
	Cube,
	CubeManager,
	CubeEventHandlers,
	CubeCollection
} from '@/core/modules'

import { Point3D } from '@/core/utils/coordinates'

export const saveCubes = async (cubes: Cube[]): Promise<void> => {
	const { updateRoom } = await import('@/ui/store/rooms')
	const { getCubeColor } = await import('@/ui/store/colors')

	const data: CubeData[] = cubes
		.filter(
			(
				cube
			): cube is Cube & {
				currentTile: NonNullable<Cube['currentTile']>
			} => cube.currentTile !== undefined
		)
		.map(({ currentTile, size, flipped }) => {
			const { position } = currentTile

			const topColor = getCubeColor(position, 'top')
			const leftColor = getCubeColor(position, 'left')
			const rightColor = getCubeColor(position, 'right')

			const colors =
				topColor !== undefined ||
				leftColor !== undefined ||
				rightColor !== undefined
					? {
							...(topColor !== undefined && { top: topColor }),
							...(leftColor !== undefined && { left: leftColor }),
							...(rightColor !== undefined && {
								right: rightColor
							})
						}
					: undefined

			return {
				position: {
					x: position.x,
					y: position.y,
					z: position.z
				},
				size: size,
				flipped: flipped,
				...(colors && { colors })
			}
		})

	updateRoom({ cubes: data })
}

export const populateCubes = (
	data: CubeData[],
	manager: CubeManager,
	eventHandlers: CubeEventHandlers,
	collection: CubeCollection,
	container: Container
): void => {
	data.forEach(({ position, size, flipped = false, colors }) => {
		const cubePosition = new Point3D(position.x, position.y, position.z)
		const validPosition = manager.getValidTilePosition(cubePosition)

		if (!validPosition) return

		const cube = manager.createCubeAtPosition(
			validPosition,
			size,
			flipped,
			colors
		)

		if (!cube) return

		eventHandlers.setup(cube)
		collection.add(cube, container)
	})
}
