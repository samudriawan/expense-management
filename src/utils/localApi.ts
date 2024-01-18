import { LocalDb } from './schema';

export function getLocalStorage() {
	const ls = localStorage.getItem('expense-data');
	if (ls) {
		const { categories, expenses, merchant, payment, incomes }: LocalDb =
			JSON.parse(ls);

		return { expenses, categories, merchant, payment, incomes };
	} else {
		return {
			expenses: [],
			categories: [],
			merchant: [],
			payment: [],
			incomes: [],
		};
	}
}

export function setLocalStorage(data: LocalDb) {
	localStorage.setItem(
		'expense-data',
		JSON.stringify(data, (key, value) => (key === 'amount' ? +value : value))
	);
}
