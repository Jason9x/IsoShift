import type { JSX } from 'preact/jsx-runtime'
import { ROOM_TEMPLATES } from '@/ui/store/rooms'

type CreateListProps = {
	onCreate: (templateIndex: number) => void
}

const CreateList = ({ onCreate }: CreateListProps): JSX.Element => (
	<div className="space-y-2">
		{ROOM_TEMPLATES.map((template, index) => (
			<button
				key={index}
				onClick={() => onCreate(index)}
				className="w-full rounded bg-gray-800 px-3 py-2 text-left transition-all hover:bg-gray-700"
			>
				<p className="text-sm font-medium">{template.name}</p>
				<p className="text-xs text-gray-400">{template.description}</p>
			</button>
		))}
	</div>
)

export default CreateList
