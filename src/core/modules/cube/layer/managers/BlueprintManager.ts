import { Container } from 'pixi.js'

import { Cube } from '@/core/modules/cube'

export class BlueprintManager {
	#blueprint?: Cube

	show(cube: Cube, container: Container): void {
		this.hide(container)

		this.#blueprint = cube
		this.#blueprint.container.alpha = 0.3
		this.#blueprint.container.eventMode = 'none'

		container.addChild(this.#blueprint.container)
	}

	hide(container: Container): void {
		if (!this.#blueprint) return

		container.removeChild(this.#blueprint.container)

		this.#blueprint.container.destroy()
		this.#blueprint = undefined
	}

	get cube(): Cube | undefined {
		return this.#blueprint
	}
}
