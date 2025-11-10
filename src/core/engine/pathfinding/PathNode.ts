import { Point3D } from '@/core/utils/coordinates'

export default class PathNode {
	readonly #position: Point3D

	#gCost: number = 0
	#fCost: number = 0

	#parent: PathNode | null = null
	#height: number = 0

	constructor(position: Point3D) {
		this.#position = position
	}

	get position(): Point3D {
		return this.#position
	}

	get gCost(): number {
		return this.#gCost
	}

	set gCost(value: number) {
		this.#gCost = value
	}

	get fCost(): number {
		return this.#fCost
	}

	set fCost(value: number) {
		this.#fCost = value
	}

	get parent(): PathNode | null {
		return this.#parent
	}

	set parent(value: PathNode | null) {
		this.#parent = value
	}

	get height(): number {
		return this.#height
	}

	set height(value: number) {
		this.#height = value
	}
}
