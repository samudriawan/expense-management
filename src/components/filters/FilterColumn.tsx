type Props = {
	categories: string[];
	filterColumn: string;
	setFilterColumn: (column: string) => void;
};

export default function FilterColumn({
	categories,
	filterColumn,
	setFilterColumn,
}: Props) {
	return (
		<>
			<h3 className="relative w-full text-md font-bold text-center tracking-wider text-neutral-300 after:content-['_'] after:absolute after:top-[50%] after:right-0 after:h-[1px] after:w-[calc(50%-3ch)] after:bg-neutral-300 before:content-['_'] before:absolute before:top-[50%] before:left-0 before:h-[1px] before:w-[calc(50%-3ch)] before:bg-neutral-300">
				Filter
			</h3>
			<div className="my-2">
				<label htmlFor="column">By Category </label>
				<select
					value={filterColumn}
					onChange={(e) => setFilterColumn(e.currentTarget.value)}
					name="column"
					id="column"
					className="select-input"
				>
					<option value="">All Categories</option>
					<option value="no category">no Category</option>
					{categories
						.filter((item) => item !== 'no category')
						.map((category, index) => (
							<option key={index} value={category}>
								{category}
							</option>
						))}
				</select>
			</div>
		</>
	);
}
