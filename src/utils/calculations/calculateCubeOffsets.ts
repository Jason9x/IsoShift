import { TILE_DIMENSIONS } from '@/constants/Tile.constants'
import { Point } from 'pixi.js'

const calculateCubeOffsets = (size: number): Point => {
	const xOffset = (TILE_DIMENSIONS.width - size) / 2;
	const yOffset = TILE_DIMENSIONS.height - size;

	return new Point(xOffset, yOffset);
}

export default calculateCubeOffsets