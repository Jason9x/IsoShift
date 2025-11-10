import { Container } from 'pixi.js'

import type { Point3D } from '@/core/utils/coordinates'

import type { Cube } from '@/core/modules'

export class CubeCollection {
	readonly #cubes: Cube[]

	constructor(cubes: Cube[]) {
		this.#cubes = cubes
	}

	add(cube: Cube, container: Container): void {
		this.#cubes.push(cube)
		container.addChild(cube.container)
	}

	remove(cube: Cube, container: Container): void {
		const index = this.#cubes.indexOf(cube)

		if (index === -1) return

		this.#cubes.splice(index, 1)

		container.removeChild(cube.container)
		cube.container.destroy()
	}

	findTallestAt = (position: Point3D): Cube | null =>
		this.#cubes.reduce((tallest: Cube | null, cube: Cube) => {
			const isAtPosition = cube.currentTile?.position.equals(position)
			const isTaller =
				cube.position.z > (tallest?.position.z ?? -Infinity)

			return isAtPosition && isTaller ? cube : tallest
		}, null)

	setEventMode = (mode: 'none' | 'dynamic'): void =>
		this.#cubes.forEach(cube => (cube.container.eventMode = mode))

	get all(): Cube[] {
		return this.#cubes
	}
}
