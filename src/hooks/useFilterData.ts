import { useEffect, useState } from 'react';
import { SortOptionType } from '../components/ExpenseDetail';
import { useMonthPeriod } from '../context/MonthPeriodContext';
import { Expense } from '../utils/schema';

type ExpenseColumn = Omit<Expense, 'id' | 'note'>;

export function useFilterData({
	expenses,
	searchText,
	filterColumn,
	sortOption,
}: {
	expenses: Expense[];
	searchText: string;
	sortOption: SortOptionType;
	filterColumn?: string;
}) {
	const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

	const { monthSelected } = useMonthPeriod();

	useEffect(() => {
		const filteredData = expenses
			.filter(
				(expense) =>
					new Date(expense.createdAt).toLocaleDateString('US', {
						month: 'long',
						year: 'numeric',
					}) === monthSelected
			)
			.filter((expense) => {
				if (!filterColumn) return expense;
				return expense.category === filterColumn;
			})
			.sort((a, b) => {
				if (sortOption.order === 'asc') {
					if (!sortOption.column) {
						return (
							new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
						);
					}

					if (sortOption.column === 'amount') return a.amount - b.amount;

					if (
						a[sortOption.column as keyof ExpenseColumn] >
						b[sortOption.column as keyof ExpenseColumn]
					) {
						return 1;
					}
				}
				if (sortOption.order === 'desc') {
					if (!sortOption.column) {
						return (
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
						);
					}

					if (sortOption.column === 'amount') return b.amount - a.amount;

					if (
						a[sortOption.column as keyof ExpenseColumn] <
						b[sortOption.column as keyof ExpenseColumn]
					) {
						return 1;
					}
				}
				return 0;
			})
			.filter(
				(expense) =>
					expense.name.toLowerCase().includes(searchText) ||
					expense.category.toLowerCase().includes(searchText)
			);
		setFilteredExpenses(filteredData);
	}, [expenses, filterColumn, sortOption, searchText, monthSelected]);

	return filteredExpenses;
}
