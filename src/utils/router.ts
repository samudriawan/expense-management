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
	params: Params<ParamParseKey<typeof RouterPaths.editExpense>>;
}

export async function AppLoader() {
	return getLocalStorage();
}

export async function newExpenseAction({ request }: { request: Request }) {
	const formData = await request.formData();
	const newEntries = convertFormData(formData);
	newEntries.id = crypto.randomUUID();

	const { expenses, categories, merchant, payment, incomes } =
		getLocalStorage();

	const isCategoryExist = categories.find(
		(value) => value === newEntries.category
	);

	if (!isCategoryExist) categories.push(newEntries.category as string);

	const isMerchantExist = merchant.find(
		(value) => value === newEntries.merchant
	);

	if (!isMerchantExist) merchant.push(newEntries.merchant as string);

	const isPaymentExist = payment.find((value) => value === newEntries.payment);

	if (!isPaymentExist) payment.push(newEntries.payment as string);

	const parsed = expenseSchema.parse(newEntries);

	expenses.push(parsed);
	setLocalStorage({ expenses, categories, merchant, payment, incomes });

	return redirect('/');
}

export async function editExpenseLoader({ params }: LoaderArgs) {
	const { expenses } = getLocalStorage();
	const expense = expenses.filter(
		(item) => item.name === params.expenseName!.replace('-', ' ')
	);
	if (expense.length < 1) throw new Response('Not Found', { status: 404 });

	expense[0].createdAt = expense[0].createdAt.slice(0, 10);

	return {
		expense: expense[0],
	};
}

export async function editExpenseAction({ request }: { request: Request }) {
	const formData = await request.formData();
	const formEntries = convertFormData(formData);

	// get what button action was clicked and remove from formData
	const actionType = formEntries['action'];
	delete formEntries['action'];

	const { expenses, categories, merchant, payment, ...others } =
		getLocalStorage();

	const isExpenseExist = expenses.findIndex(
		(expense: Expense) => expense.id === formEntries.id
	);

	if (isExpenseExist === -1) {
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

			const isCategoryExist = categories.find(
				(value) => value === formEntries.category
			);

			if (!isCategoryExist) categories.push(formEntries.category as string);

			const isMerchantExist = merchant.find(
				(value) => value === formEntries.merchant
			);

			if (!isMerchantExist) merchant.push(formEntries.merchant as string);

			// merge the changes field
			const updated = { ...findExpense, ...formEntries };

			expenses[isExpenseExist] = updated;
			const assemble = { expenses, categories, merchant, payment, ...others };

			setLocalStorage(assemble);
			return redirect('/');
		}

		case 'delete': {
			expenses.splice(isExpenseExist, 1);
			const assemble = { expenses, categories, merchant, payment, ...others };

			setLocalStorage(assemble);
			return redirect('/');
		}
		default:
			console.log('Action not recognized.');
			throw new Error('Action not recognized.');
	}
}

export async function settingsLoader() {
	const { expenses, categories, payment, merchant, incomes } =
		getLocalStorage();

	return { expenses, categories, payment, merchant, incomes };
}

export async function settingsAction({ request }: { request: Request }) {
	const formData = await request.formData();
	const formEntries = convertFormData<{
		data: string;
		index?: number;
		action?: string;
		callback: string;
	}>(formData);

	// get what button action was clicked and remove from formData
	const actionType = formEntries['action'];
	delete formEntries['action'];

	const { categories, expenses, merchant, ...others } = getLocalStorage();

	switch (actionType) {
		// categories repositories
		case 'create_category': {
			if (categories.includes(formEntries.data)) {
				return { error: `Category "${formEntries.data}" already exists.` };
			}
			categories.push(formEntries.data);

			setLocalStorage({ categories, expenses, merchant, ...others });
			return redirect(formEntries.callback);
		}

		case 'edit_category': {
			const parsedCategories: string[] = JSON.parse(formEntries.data);
			const changedValue = parsedCategories.filter(
				(item) => !categories.includes(item)
			);
			const changedValueIndex = categories.findIndex(
				(item) =>
					item ===
					categories.filter((item) => !parsedCategories.includes(item))[0]
			);
			const newCategories = [...categories].map((item, i) =>
				i === changedValueIndex ? changedValue[0] : item
			);

			setLocalStorage({
				categories: newCategories,
				expenses,
				merchant,
				...others,
			});
			return redirect(formEntries.callback);
		}

		case 'delete_category': {
			const associatedCategory = Array.from(
				new Set(expenses.map((item) => item.category))
			);
			const deletedValue = categories[formEntries.index!];

			if (associatedCategory.includes(deletedValue)) {
				return {
					error: 'Cannot delete category that has associated in expense.',
				};
			}

			const filteredCategories: string[] = JSON.parse(formEntries.data);

			if (filteredCategories.length <= 0) {
				setLocalStorage({ categories: [], expenses, merchant, ...others });
				return redirect(formEntries.callback);
			}

			setLocalStorage({
				categories: [...categories].filter(
					(_, index) =>
						index !== categories.findIndex((item) => item === deletedValue)
				),
				expenses,
				merchant,
				...others,
			});
			return redirect(formEntries.callback);
		}

		// merchants repositories
		case 'create_merchant': {
			if (merchant.includes(formEntries.data)) {
				return { error: `Merchant "${formEntries.data}" already exists.` };
			}
			merchant.push(formEntries.data);

			setLocalStorage({ categories, expenses, merchant, ...others });
			return redirect(formEntries.callback);
		}

		case 'edit_merchant': {
			const parsedMerchants: string[] = JSON.parse(formEntries.data);
			const changedValue = parsedMerchants.filter(
				(item) => !merchant.includes(item)
			);
			const changedValueIndex = merchant.findIndex(
				(item) =>
					item === merchant.filter((item) => !parsedMerchants.includes(item))[0]
			);
			const newMerchants = [...merchant].map((item, i) =>
				i === changedValueIndex ? changedValue[0] : item
			);

			setLocalStorage({
				categories,
				expenses,
				merchant: newMerchants,
				...others,
			});
			return redirect(formEntries.callback);
		}

		case 'delete_merchant': {
			const associatedMerchant = Array.from(
				new Set(expenses.map((item) => item.merchant))
			);
			const deletedValue = merchant[formEntries.index!];

			if (associatedMerchant.includes(deletedValue)) {
				return {
					error: 'Cannot delete merchant that has associated in expense.',
				};
			}

			const filteredMerchant: string[] = JSON.parse(formEntries.data);

			if (filteredMerchant.length <= 0) {
				setLocalStorage({ categories, merchant: [], expenses, ...others });
				return redirect(formEntries.callback);
			}

			setLocalStorage({
				merchant: [...merchant].filter(
					(_, index) =>
						index !== merchant.findIndex((item) => item === deletedValue)
				),
				expenses,
				categories,
				...others,
			});
			return redirect(formEntries.callback);
		}

		default:
			console.log('Action not recognized.');
			throw new Response('Action not recognized.', { status: 500 });
	}
}

export function convertFormData<
	T = {
		[k: string]: string | number;
	}
>(data: FormData): T {
	const formEntries = Object.fromEntries(data);
	const result: T = JSON.parse(JSON.stringify(formEntries), (key, value) =>
		key === 'amount' || key === 'index' ? +value : value
	);
	return result;
}
