import { useEffect, useState } from 'react';
import { SortOptionType } from '../ExpenseDetail';

type Props = {
	sortOption: SortOptionType;
	setSortOption: (v: SortOptionType) => void;
};

export default function SortColumn({ sortOption, setSortOption }: Props) {
	const [selectedColumn, setSelectedColumn] = useState('');
	const [isAscending, setIsAscending] = useState(true);

	useEffect(() => {
		handleSortingOption();
	}, [selectedColumn, isAscending]);

	useEffect(() => {
		if (!sortOption.column) {
			setSelectedColumn('');
			setIsAscending(true);
		}
	}, [sortOption.column]);

	useEffect(() => {
		if (sortOption.order === 'asc') {
			setIsAscending(true);
		}
	}, [sortOption.order]);

	function handleSortingOption() {
		switch (selectedColumn) {
			case 'Date':
				setSortOption({
					order: isAscending ? 'asc' : 'desc',
					column: 'createdAt',
				});
				break;
			case 'Name':
				setSortOption({
					order: isAscending ? 'asc' : 'desc',
					column: 'name',
				});
				break;
			case 'Category':
				setSortOption({
					order: isAscending ? 'asc' : 'desc',
					column: 'category',
				});
				break;
			case 'Amount':
				setSortOption({
					order: isAscending ? 'asc' : 'desc',
					column: 'amount',
				});
				break;

			default:
				setSortOption({
					order: isAscending ? 'asc' : 'desc',
					column: '',
				});
				break;
		}
	}

	return (
		<>
			<h3 className="relative w-full text-md font-bold text-center tracking-wider text-neutral-300 after:content-['_'] after:absolute after:top-[50%] after:right-0 after:h-[1px] after:w-[calc(50%-3ch)] after:bg-neutral-300 before:content-['_'] before:absolute before:top-[50%] before:left-0 before:h-[1px] before:w-[calc(50%-3ch)] before:bg-neutral-300">
				Sort
			</h3>

			<div className="flex justify-between items-center my-2">
				<div>
					<label htmlFor="column">Sort by </label>
					<select
						value={selectedColumn}
						onChange={(e) => setSelectedColumn(e.currentTarget.value)}
						name="column"
						id="column"
						className="select-input"
					>
						{['Date', 'Name', 'Category', 'Amount'].map((item, index) => (
							<option key={index} value={item}>
								{item}
							</option>
						))}
					</select>
				</div>
				<div className="inline">
					<input
						type="checkbox"
						name="ascending"
						id="ascending"
						checked={isAscending}
						onChange={() => setIsAscending((prev) => !prev)}
					/>
					<label htmlFor="ascending"> ascending</label>
				</div>
			</div>
		</>
	);
}
