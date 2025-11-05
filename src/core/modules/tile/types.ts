export type TileDimensions = {
	width: number
	height: number
	thickness: number
}

export type TileStyle = {
	fillColor: number
	borderColor?: number
	borderWidth?: number
}

export type TileStyles = {
	surface: TileStyle
	leftBorder: TileStyle
	rightBorder: TileStyle
}

export type TileCoordinates = {
	surface: number[]
	leftBorder: number[]
	rightBorder: number[]
}
