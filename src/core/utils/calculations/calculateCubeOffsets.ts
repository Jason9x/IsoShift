import { Point } from 'pixi.js'

import { TILE_DIMENSIONS } from '@/core/modules/tile/constants'

const calculateCubeOffsets = (size: number): Point => {
	const xOffset = size - TILE_DIMENSIONS.width / 2
	const yOffset = size - TILE_DIMENSIONS.height / 2

	return new Point(xOffset, yOffset)
}

export default calculateCubeOffsets
