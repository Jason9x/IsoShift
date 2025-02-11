import Tile from '@/modules/tile/Tile'
import Cube from '@/modules/cube/Cube'
import AvatarContainer from '@/modules/avatar/AvatarContainer'

import Point3D from '@/utils/coordinates/Point3D'

export default interface IAvatar {
	currentTile: Tile | undefined
	goalPosition: Point3D | null
	isMoving: boolean

	initialize(): void

	calculatePath(isRecalculating?: boolean): Promise<void>

	update(delta: number): Promise<void>

	adjustPositionOnCubeDrag(cube: Cube): void

	adjustRenderingOrder(cubes: Cube[]): void

	container: AvatarContainer
	position: Point3D
}
