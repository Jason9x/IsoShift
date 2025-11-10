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
			const isAtPosition =
				cube.currentTile?.position.x === position.x &&
				cube.currentTile?.position.y === position.y

			if (!isAtPosition) return tallest

			if (!tallest) return cube

			const tallestTop = tallest.position.z + tallest.size
			const currentTop = cube.position.z + cube.size

			return currentTop > tallestTop ? cube : tallest
		}, null)

	setEventMode = (mode: 'none' | 'dynamic'): void =>
		this.#cubes.forEach(cube => this.#configureCubeEvents(cube, mode))

	#configureCubeEvents(cube: Cube, mode: 'none' | 'dynamic'): void {
		cube.container.eventMode = 'dynamic'

		cube.container.faces.forEach(face => {
			if (!face) return

			face.eventMode = mode

			if (mode === 'none') face.hitArea = null
		})
	}

	get all(): Cube[] {
		return this.#cubes
	}
}
