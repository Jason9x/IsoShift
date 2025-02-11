import container from '@/inversify.config'

import WallDirection from '@/modules/wall/WallDirection'
import WallContainer from '@/modules/wall/WallContainer'

import IWallMap from '@/interfaces/modules/IWallMap'

import { FaceKey } from '@/types/BoxFaces.types'

import Point3D from '@/utils/coordinates/Point3D'
import { cartesianToIsometric } from '@/utils/coordinates/coordinateTransformations'

import createColorInput from '@/utils/helpers/colorInputHelper'

export default class Wall {
	readonly #position: Point3D
	readonly #direction: WallDirection
	readonly #container: WallContainer

	constructor(position: Point3D, direction: WallDirection) {
		this.#position = position
		this.#direction = direction
		this.#container = new WallContainer(
			cartesianToIsometric(this.#position),
			this.#direction
		)

		this.#setupEventListeners()
	}

	#setupEventListeners = () =>
		this.#container.sides.forEach(side =>
			side.forEach((face, key) =>
				face?.on('rightclick', this.#handleFaceClick.bind(this, key))
			)
		)

	#handleFaceClick = (key: FaceKey) =>
		createColorInput(hexColor =>
			container
				.get<IWallMap>('IWallMap')
				.walls.forEach(
				wall =>
					wall.#direction === this.#direction &&
					wall.#container.sides.forEach(side =>
						side.get(key)?.initialize(hexColor)
					)
			)
		)

	get container() {
		return this.#container
	}
}
