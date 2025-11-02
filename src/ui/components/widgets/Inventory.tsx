import { inventory } from '../../store/inventory'

const Inventory = ({ isOpen }: { isOpen: boolean }) => (
	<>
		{isOpen && (
			<div className="pointer-events-auto absolute bottom-4 left-4 min-w-48 rounded-lg border border-gray-800/50 bg-gray-950/85 px-4 py-3 text-gray-200 shadow-2xl backdrop-blur-md">
				<h3 className="mb-2 text-sm font-bold">Inventory</h3>

				{inventory.value.length === 0 ? (
					<p className="text-sm text-gray-400">Empty</p>
				) : (
					<ul className="space-y-1">
						{inventory.value.map((item, i) => (
							<li key={i} className="text-sm">
								{item}
							</li>
						))}
					</ul>
				)}
			</div>
		)}
	</>
)

export default Inventory
