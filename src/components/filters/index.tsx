import { Expense } from '../../utils/schema';
import { SortOptionType } from '../ExpenseDetail';
import FilterColumn from './FilterColumn';
import SortColumn from './SortColumn';
import { useLoaderData } from 'react-router-dom';

type Props = {
	isFilterOpen: boolean;
	filterColumn: string;
	setFilterColumn: (column: string) => void;
	sortOption: SortOptionType;
	setSortOption: (option: SortOptionType) => void;
};

export default function Filters({
	isFilterOpen,
	filterColumn,
	setFilterColumn,
	sortOption,
	setSortOption,
}: Props) {
	const { categories } = useLoaderData() as {
		categories: string[];
		expenses: Expense[];
	};

	return (
		<>
			<div
				className={`${
					isFilterOpen ? 'flex flex-col flex-grow h-full p-2' : 'hidden h-0 p-0'
				} mb-3 rounded-md bg-neutral-800 transition-all`}
			>
				<button
					type="button"
					onClick={() => {
						setSortOption({
							order: 'asc',
							column: '',
						});
						setFilterColumn('');
					}}
					className="w-fit self-end text-[#035bff] hover:underline font-bold"
				>
					Reset
				</button>

				{/* sorting section below */}
				<SortColumn sortOption={sortOption} setSortOption={setSortOption} />

				{/* filtering section below */}
				<FilterColumn
					categories={categories ? categories : []}
					filterColumn={filterColumn}
					setFilterColumn={setFilterColumn}
				/>
			</div>
		</>
	);
}
