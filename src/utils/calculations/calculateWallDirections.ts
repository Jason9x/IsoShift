import { WallDirection } from '@/modules/wall'

const calculateWallDirections = (x: number, y: number): WallDirection[] => {
	if (x === 0 && y === 0) return [WallDirection.Left, WallDirection.Right]
	if (x === 0) return [WallDirection.Left]
	if (y === 0) return [WallDirection.Right]

	return []
}

export default calculateWallDirections
