import { currentRoom, updateRoom } from './rooms/logic'
import type { AvatarColors, TileColors, CubeData } from './rooms/types'

export const getCubeColor = (
	position: { x: number; y: number; z: number },
	face: 'top' | 'left' | 'right'
): number | undefined => {
	const room = currentRoom()

	if (!room) return undefined

	return findCubeByPosition(room.cubes, position)?.colors?.[face]
}

const findCubeByPosition = (
	cubes: CubeData[],
	position: { x: number; y: number; z: number }
): CubeData | undefined =>
	cubes.find(
		cube =>
			cube.position.x === position.x &&
			cube.position.y === position.y &&
			cube.position.z === position.z
	)

export const setCubeColor = (
	position: { x: number; y: number; z: number },
	face: 'top' | 'left' | 'right',
	color: number
): void => {
	const room = currentRoom()

	if (!room) return

	const cubes = room.cubes.map(cube => {
		if (
			cube.position.x !== position.x ||
			cube.position.y !== position.y ||
			cube.position.z !== position.z
		)
			return cube

		return {
			...cube,
			colors: {
				...cube.colors,
				[face]: color
			}
		}
	})

	updateRoom({ cubes })
}

export const getTileColor = (
	face: 'surface' | 'leftBorder' | 'rightBorder'
): number | undefined => {
	const room = currentRoom()

	if (!room) return undefined

	return room.tileColors?.[face]
}

export const setTileColor = (
	face: 'surface' | 'leftBorder' | 'rightBorder',
	color: number
): void => {
	const room = currentRoom()

	if (!room) return

	const tileColors: TileColors = {
		...(room.tileColors || {}),
		[face]: color
	}

	updateRoom({ tileColors })
}

export const getWallColor = (
	face: 'top' | 'left' | 'right'
): number | undefined => {
	const room = currentRoom()

	if (!room) return undefined

	return room.wallColors?.[face]
}

export const setWallColor = (
	face: 'top' | 'left' | 'right',
	color: number
): void => {
	const room = currentRoom()

	if (!room) return

	const wallColors = {
		...(room.wallColors || {}),
		[face]: color
	}

	updateRoom({ wallColors })
}

export const getAvatarColor = (
	face: 'top' | 'left' | 'right'
): number | undefined => {
	const room = currentRoom()

	if (!room) return undefined

	return room.avatarColors?.[face]
}

export const setAvatarColor = (
	face: 'top' | 'left' | 'right',
	color: number
): void => {
	const room = currentRoom()

	if (!room) return

	const avatarColors: AvatarColors = {
		...(room.avatarColors || {}),
		[face]: color
	}

	updateRoom({ avatarColors })
}
