import { RouterPaths } from '../main';
import { Expense, expenseSchema } from './schema';
import { getLocalStorage, setLocalStorage } from './localApi';
import {
	ActionFunctionArgs,
	ParamParseKey,
	Params,
	redirect,
} from 'react-router-dom';

interface LoaderArgs extends ActionFunctionArgs {
	params: Params<ParamParseKey<typeof RouterPaths.expense>>;
}

export async function AppLoader() {
	return getLocalStorage();
}

export async function newExpenseAction({ request }: { request: Request }) {
	const formData = await request.formData();
	const newEntries = convertFormData(formData);
	newEntries.id = crypto.randomUUID();

	const { expenses, categories, incomes } = getLocalStorage();

	const isCategoryExist = categories.find(
		(value) => value === newEntries.category
	);

	if (!isCategoryExist) categories.push(newEntries.category as string);

	const parsed = expenseSchema.parse(newEntries);

	expenses.push(parsed);
	setLocalStorage({ expenses, categories, incomes });

	return redirect('/');
}

export async function editExpenseLoader({ params }: LoaderArgs) {
	const { expenses, categories, incomes } = getLocalStorage();
	const expense = expenses.filter(
		(item) => item.name === params.expenseName!.replace('-', ' ')
	);
	if (expense.length < 1) throw new Response('Not Found', { status: 404 });

	expense[0].createdAt = expense[0].createdAt.slice(0, 10);

	return { categories: categories, expense: expense[0], incomes: incomes };
}

export async function editExpenseAction({ request }: { request: Request }) {
	const formData = await request.formData();
	const formEntries = convertFormData(formData);

	// get what button action was clicked and remove from formData
	const actionType = formEntries['action'];
	delete formEntries['action'];

	const { expenses, ...others } = getLocalStorage();

	const isExpenseExist = expenses.findIndex(
		(expense: Expense) => expense.id === formEntries.id
	);

	if (!isExpenseExist) {
		console.log('[x]expenses not exist', isExpenseExist);
		throw new Error('Expense not found.');
	}

	const findExpense = expenses[isExpenseExist];

	switch (actionType) {
		case 'save': {
			// do not save to database if expense is not changes when user click save button
			const expenseNotChange = [];

			if (
				new Date(formEntries.createdAt).toDateString() ===
				new Date(findExpense.createdAt).toDateString()
			) {
				expenseNotChange.push(true);
				delete formEntries['createdAt'];
			} else {
				expenseNotChange.push(false);
			}

			for (const key in findExpense) {
				if (key === 'createdAt') continue;
				if (
					formEntries[key as keyof Expense] ===
					findExpense[key as keyof Expense]
				) {
					expenseNotChange.push(true);
				} else {
					expenseNotChange.push(false);
				}
			}

			if (expenseNotChange.every((x) => x === true)) return redirect('/');

			// merge the changes field
			const updated = { ...findExpense, ...formEntries };

			expenses[isExpenseExist] = updated;
			const assemble = { expenses, ...others };

			setLocalStorage(assemble);
			return redirect('/');
		}

		case 'delete': {
			expenses.splice(isExpenseExist, 1);
			const assemble = { expenses, ...others };

			setLocalStorage(assemble);
			return redirect('/');
		}
		default:
			console.log('Action not recognized.');
			throw new Error('Action not recognized.');
	}
}

export function convertFormData(data: FormData) {
	const formEntries = Object.fromEntries(data);
	const result: {
		[k: string]: string | number;
	} = JSON.parse(JSON.stringify(formEntries), (key, value) =>
		key === 'amount' ? +value : value
	);
	return result;
}
