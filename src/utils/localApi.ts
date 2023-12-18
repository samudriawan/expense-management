import { Expense, IncomeList, LocalDb } from './schema';

export function getLocalStorage() {
	const ls = localStorage.getItem('expense-seed');
	if (ls) {
		const {
			categories,
			expenses,
			incomes,
		}: { categories: string[]; expenses: Expense[]; incomes: IncomeList[] } =
			JSON.parse(ls);

		return { expenses, categories, incomes };
	} else {
		return { expenses: [], categories: [], incomes: [] };
	}
}

export function setLocalStorage(data: LocalDb) {
	localStorage.setItem(
		'expense-seed',
		JSON.stringify(data, (key, value) => (key === 'amount' ? +value : value))
	);
}
