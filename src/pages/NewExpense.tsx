import { Link, useLoaderData, useSubmit } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import { Expense } from '../utils/schema';
import ExpenseForm from '../components/ExpenseForm';
import { FaArrowLeftLong } from 'react-icons/fa6';

export default function NewExpense() {
	const expensesData = useLoaderData() as {
		categories: string[];
		expenses: Expense[];
	};
	const routerSubmit = useSubmit();

	const onSubmit: SubmitHandler<Expense> = (data) => {
		// console.log(data);
		routerSubmit(data, { method: 'post' });
	};

	return (
		<>
			<Link to="/" className="btn-primary my-2" data-testid="income-back-link">
				<span className="flex items-center gap-2">
					<FaArrowLeftLong /> Back
				</span>
			</Link>

			<ExpenseForm
				categoryList={expensesData.categories}
				type="create"
				onSubmit={onSubmit}
			/>
		</>
	);
}
