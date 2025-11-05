export type WallDimensions = {
	height: number
	thickness: number
}

export type WallStyle = {
	fillColor: number
	borderColor?: number
	borderWidth?: number
}

export type WallStyles = {
	surface: WallStyle
	border: WallStyle
	borderTop: WallStyle
}

export type WallSideStyles = {
	left: WallStyles
	right: WallStyles
}

export type WallSidesCoordinates = {
	surface: number[]
	border: number[]
	borderTop: number[]
}

export type WallCoordinates = {
	left: WallSidesCoordinates
	right: WallSidesCoordinates
}
