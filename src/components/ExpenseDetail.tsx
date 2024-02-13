import { useState, useEffect } from 'react';
import { Link, useNavigate, useRouteLoaderData } from 'react-router-dom';
import Filters from './filters';
import SearchInput from './filters/SearchInput';
import { BsFilter } from 'react-icons/bs';
import { useFilterData } from '../hooks/useFilterData';
import { Expense, LocalDb } from '../utils/schema';

export type SortOptionType = {
	order: 'asc' | 'desc';
	column: string;
};

export default function ExpenseDetail() {
	const allData = useRouteLoaderData('root') as LocalDb;
	const [expensesData, setExpensesData] = useState<Expense[]>(
		() => allData.expenses
	);
	const [showFilterOption, setShowFilterOption] = useState({
		isOpen: false,
		filterOption: '',
	});
	const [searchExpense, setSearchExpense] = useState('');
	const [filterColumn, setFilterColumn] = useState('');
	const [sortOption, setSortOption] = useState<SortOptionType>({
		order: 'asc',
		column: '',
	});
	const navigate = useNavigate();
	const filterExpenses = useFilterData({
		expenses: expensesData,
		searchText: searchExpense,
		filterColumn: filterColumn,
		sortOption: sortOption,
	});

	useEffect(() => {
		setExpensesData(allData.expenses);
	}, [allData]);

	return (
		<section className="my-2">
			<h2 className="text-2xl md:text-3xl font-semibold">Expenses details</h2>
			<p className="text-xl md:text-2xl font-bold">
				<span className="text-3xl text-[#035bff]">{filterExpenses.length}</span>{' '}
				Total Expenses
			</p>
			<div className="flex gap-2">
				<SearchInput
					searchText={searchExpense}
					setSearchText={setSearchExpense}
				/>
				<button
					type="button"
					onClick={() =>
						setShowFilterOption({
							...showFilterOption,
							isOpen: !showFilterOption.isOpen,
						})
					}
					className="btn-primary h-10 inline-flex items-center my-auto px-2 md:px-6 bg-transparent hover:bg-neutral-800 border-transparent hover:border-transparent hover:text-white"
				>
					<BsFilter />
					<span className="ms-1">Filter</span>
				</button>
			</div>

			{/* filter options */}
			<Filters
				isFilterOpen={showFilterOption.isOpen}
				filterColumn={filterColumn}
				setFilterColumn={setFilterColumn}
				sortOption={sortOption}
				setSortOption={setSortOption}
			/>

			{/* expenses table */}
			<div className="pb-2 overflow-x-auto">
				<table className="table border-collapse border border-neutral-700 whitespace-nowrap w-full">
					<thead>
						<tr className="h-9">
							<th className="border border-neutral-500">Date</th>
							<th className="border border-neutral-500">Name</th>
							<th className="border border-neutral-500">Category</th>
							<th className="border border-neutral-500">Amount</th>
						</tr>
					</thead>
					<tbody>
						{filterExpenses.map((expense, index) => (
							<tr
								key={index}
								className="h-10 text-center cursor-pointer hover:bg-[rgba(3,91,255,0.1)]"
								onClick={() =>
									navigate(`/${expense.name.replace(' ', '-')}/edit`)
								}
							>
								<td
									className="px-0 border border-neutral-500"
									title={new Date(expense.createdAt).toLocaleDateString(
										'us-US',
										{
											day: '2-digit',
											month: 'short',
											year: 'numeric',
										}
									)}
								>
									{new Date(expense.createdAt).toLocaleDateString('us-US', {
										day: '2-digit',
										month: 'short',
										year: 'numeric',
									})}
								</td>
								<td className="px-2 border border-neutral-500 truncate">
									<Link
										to={`/${expense.name.replace(' ', '-')}/edit`}
										title={expense.name}
									>
										{expense.name}
									</Link>
								</td>
								<td
									className="px-0 border border-neutral-500"
									title={expense.category}
								>
									{expense.category}
								</td>
								<td
									className="px-2 border border-neutral-500 truncate"
									title={new Intl.NumberFormat(['us-ID', 'us-US'], {
										style: 'currency',
										currency: 'IDR',
										maximumFractionDigits: 0,
									}).format(expense.amount)}
								>
									{new Intl.NumberFormat(['us-ID', 'us-US'], {
										style: 'currency',
										currency: 'IDR',
										maximumFractionDigits: 0,
									}).format(expense.amount)}
								</td>
							</tr>
						))}
						<tr className="h-10 text-center">
							<td className="border border-neutral-500 ">
								{filterExpenses.length} items
							</td>
							<td colSpan={2} className="font-bold border border-neutral-500 ">
								sub total
							</td>
							<td className="font-bold border border-neutral-500 truncate">
								{new Intl.NumberFormat(['us-ID', 'us-US'], {
									style: 'currency',
									currency: 'IDR',
									maximumFractionDigits: 0,
								}).format(
									filterExpenses
										.filter(
											(expense) =>
												expense.name.toLowerCase().includes(searchExpense) ||
												expense.category.toLowerCase().includes(searchExpense)
										)
										.map((x) => x.amount)
										.reduce((acc, curr) => acc + curr, 0)
								)}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	);
}
