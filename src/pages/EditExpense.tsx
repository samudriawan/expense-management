import { useLoaderData, useSubmit } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Expense } from '../utils/schema';
import ExpenseForm from '../components/ExpenseForm';
import { FaArrowLeftLong } from 'react-icons/fa6';

export default function EditExpense() {
	const { expense } = useLoaderData() as {
		categories: string[];
		expense: Expense;
	};
	const routerSubmit = useSubmit();

	const onSubmit: SubmitHandler<Expense> = (data) => {
		const addAction = { ...data, action: 'save' };
		// console.log('[x]onsubmit ', addAction);
		routerSubmit(addAction, { method: 'post' });
	};

	const onDelete: SubmitHandler<Expense> = (data) => {
		const addAction = { ...data, action: 'delete' };
		// console.log('[x]ondelete ', addAction);
		routerSubmit(addAction, { method: 'post' });
	};

	return (
		<>
			<Link to="/" className="btn-primary my-2" data-testid="income-back-link">
				<span className="flex items-center gap-2">
					<FaArrowLeftLong /> Back
				</span>
			</Link>

			<ExpenseForm
				type="edit"
				defaultValues={expense}
				onSubmit={onSubmit}
				onDelete={onDelete}
			/>
		</>
	);
}
