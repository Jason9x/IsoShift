export class CubeMenuHandler {
	#justFinishedDragging = false

	blockClicks(): void {
		this.#justFinishedDragging = true

		setTimeout(() => (this.#justFinishedDragging = false), 100)
	}

	get justFinishedDragging(): boolean {
		return this.#justFinishedDragging
	}
}
