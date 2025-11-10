import type { JSX } from 'preact'
import type { RefObject, TargetedEvent } from 'preact'

type NumberInputProps = {
	label: string
	value: number
	min?: number
	max?: number
	onChange: (value: number) => void
	inputRef: RefObject<HTMLInputElement>
}

const NumberInput = ({
	label,
	value,
	min = 1,
	max,
	onChange,
	inputRef
}: NumberInputProps): JSX.Element => {
	const clampValue = (val: number): number => {
		const clamped = Math.max(min, val)

		return max !== undefined ? Math.min(max, clamped) : clamped
	}

	const handleInput = (event: TargetedEvent<HTMLInputElement>): void => {
		const inputValue = event.currentTarget.value
		const numericValue = +inputValue

		if (inputValue === '' && isNaN(numericValue)) return

		onChange(clampValue(numericValue))
	}

	const handleChange = (event: TargetedEvent<HTMLInputElement>): void => {
		const inputValue = event.currentTarget.value
		const numericValue = +inputValue

		if (inputValue === '' || isNaN(numericValue)) return

		onChange(clampValue(numericValue))
	}

	const handleBlur = (e: JSX.TargetedEvent<HTMLInputElement>): void => {
		const inputValue = e.currentTarget.value
		const numericValue = +inputValue
		const clamped =
			inputValue === '' || isNaN(numericValue)
				? clampValue(value)
				: clampValue(numericValue)

		onChange(clamped)
	}

	return (
		<label className="block">
			<span className="mb-1 block text-xs text-gray-400">{label}</span>

			<input
				ref={inputRef}
				type="number"
				min={min}
				max={max}
				value={value}
				onInput={handleInput}
				onChange={handleChange}
				onBlur={handleBlur}
				className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-200 [appearance:textfield] focus:border-gray-600 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
			/>
		</label>
	)
}

export default NumberInput
