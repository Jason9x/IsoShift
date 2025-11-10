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

			return {
				position: {
					x: position.x,
					y: position.y,
					z: position.z
				},
				size: size,
				flipped: flipped
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
	data.forEach(({ position, size, flipped = false }) => {
		const cubePosition = new Point3D(position.x, position.y, position.z)
		const validPosition = manager.getValidTilePosition(cubePosition)

		if (!validPosition) return

		const cube = manager.createCubeAtPosition(validPosition, size, flipped)

		if (!cube) return

		eventHandlers.setup(cube)
		collection.add(cube, container)
	})
}
