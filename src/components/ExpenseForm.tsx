import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Expense } from '../utils/schema';

type FormProps = {
	defaultValues?: Expense;
	categoryList: string[];
	type: 'create' | 'edit';
	onSubmit: SubmitHandler<Expense>;
	onDelete?: SubmitHandler<Expense>;
};

export default function ExpenseForm({
	defaultValues,
	categoryList,
	type,
	onSubmit,
	onDelete,
}: FormProps) {
	const [categories, setCategories] = useState<string[]>([]);
	const [newCategory, setNewCategory] = useState('');
	const [isInputCategoryActive, setIsInputCategoryActive] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const confirmModalRef = useRef<HTMLDivElement>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Expense>({ defaultValues: defaultValues });

	useEffect(() => {
		const filterCategories = categoryList.filter(
			(item) => item !== 'no category'
		);
		setCategories(Array.from(new Set(filterCategories)));
	}, [categoryList]);

	useEffect(() => {
		const handleClickOutsideModal = (event: Event) => {
			const target = event.target as Element;
			if (
				confirmModalRef.current &&
				!confirmModalRef.current?.contains(target)
			) {
				setShowModal(false);
			}
		};

		document.addEventListener('click', handleClickOutsideModal, true);

		return () => {
			document.removeEventListener('click', handleClickOutsideModal, true);
		};
	}, [setShowModal]);

	return (
		<>
			<form method="post" className="flex flex-col gap-3 my-4">
				<div className="flex flex-col gap-2">
					<div className="flex justify-between">
						<label htmlFor="expenseCreateDate">Date</label>
						{errors.createdAt?.message && (
							<span className="text-red-500 italic">
								{errors.createdAt.message}
							</span>
						)}
					</div>
					<input
						type="date"
						defaultValue={new Date().toISOString().slice(0, 10)}
						{...register('createdAt', {
							required: 'Please pick a date.',
							setValueAs: (v) => {
								const time = new Date().toISOString().slice(10);
								return v + time;
							},
						})}
						id="expenseCreateDate"
						className="w-fit "
					/>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex justify-between">
						<label htmlFor="expenseName">Expense name</label>
						{errors.name?.message && (
							<span className=" text-red-500 italic">
								{errors.name.message}
							</span>
						)}
					</div>
					<input
						type="text"
						id="expenseName"
						{...register('name', {
							required: 'Expense must have a name.',
							setValueAs: (v) => v.trim(),
						})}
						placeholder="Name of expenses"
						className="form-input"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex justify-between">
						<label htmlFor="expenseCategory">Select Category</label>
						{errors.category?.message && (
							<span className=" text-red-500 italic">
								{errors.category.message}
							</span>
						)}
					</div>
					<select
						{...register('category')}
						id="expenseCategory"
						className="h-8 px-4 rounded-lg"
					>
						<option value="no category">no category</option>
						{categories.map((cat, index) => (
							<option key={index} value={cat}>
								{cat}
							</option>
						))}
					</select>

					{/* ---
							input field for creating new category
							---
					 */}
					<div className="mt-2 flex">
						<input
							type="text"
							id="createCategory"
							placeholder="Type new category"
							value={newCategory}
							onChange={(e) => setNewCategory(e.currentTarget.value)}
							className="form-input rounded-e-none border-r-0"
							// when Enter key is press while this input is on focus, do not submit the Form
							onFocus={() => setIsInputCategoryActive(true)}
							onBlur={() => setIsInputCategoryActive(false)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									if (!e.currentTarget.value) return;
									setCategories((prev) => [...prev, newCategory.trim()]);
									setNewCategory('');
								}
							}}
						/>
						<button
							type="button"
							className="btn-primary w-6/12 py-0 px-2 rounded-s-none"
							onClick={() => {
								if (!newCategory) return;
								setCategories((prev) => [...prev, newCategory.trim()]);
								setNewCategory('');
							}}
						>
							Add Category
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex justify-between">
						<label htmlFor="expenseAmount">Merchant</label>
						{errors.merchant?.message && (
							<span className="text-red-500 italic">
								{errors.merchant.message}
							</span>
						)}
					</div>
					<input
						type="text"
						{...register('merchant')}
						id="expenseMerchant"
						placeholder="Type to add merchant"
						className="form-input"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex justify-between">
						<label htmlFor="expenseAmount">Amount</label>
						{errors.amount?.message && (
							<span className="text-red-500 italic">
								{errors.amount.message}
							</span>
						)}
					</div>
					<input
						type="number"
						{...register('amount', {
							required: 'Amount can not be blank.',
							valueAsNumber: true,
						})}
						id="expenseAmount"
						placeholder="Expense amount"
						className="form-input"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<div className="flex justify-between">
						<label htmlFor="expensePayment">Paid with</label>
						{errors.payment?.message && (
							<span className="text-red-500 italic">
								{errors.payment.message}
							</span>
						)}
					</div>
					<input
						type="text"
						{...register('payment', {
							required: 'Payment can not be blank.',
						})}
						id="expensePayment"
						placeholder="Paid with"
						className="form-input"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<div className="flex justify-between">
						<label htmlFor="expenseAmount">Note</label>
						{errors.note?.message && (
							<span className="text-red-500 italic">{errors.note.message}</span>
						)}
					</div>
					<textarea
						{...register('note')}
						id="expenseNote"
						placeholder="Additional information"
						className="form-input"
					/>
				</div>
			</form>

			<div className="flex justify-between gap-2 my-3">
				<input
					type={isInputCategoryActive ? 'button' : 'submit'}
					value="Save"
					onClick={handleSubmit(onSubmit)}
					className="btn-primary w-full py-2"
				/>
				{type === 'edit' && (
					<button
						type="button"
						onClick={() => {
							setShowModal(true);
						}}
						className="btn-primary w-full bg-transparent text-red-600 border-red-600 hover:bg-red-400 hover:bg-opacity-5 hover:text-red-600 hover:border-red-600"
					>
						Delete
					</button>
				)}
			</div>

			<div
				className={
					`${
						showModal
							? 'absolute inset-0 flex justify-center items-center'
							: 'hidden'
					}` + ' text-center bg-[rgba(0,0,0,0.5)]'
				}
			>
				<div
					ref={confirmModalRef}
					className="relative px-2 md:px-8 py-4 md:py-8 -translate-y-10 bg-neutral-800 rounded-md"
				>
					<p className="text-lg">Are you sure want to delete this record?</p>
					<div className=""></div>
					<div className="flex justify-end items-center gap-2 mt-4">
						<button
							type="button"
							className="btn-danger"
							onClick={onDelete && handleSubmit(onDelete)}
						>
							Delete
						</button>
						<button
							type="button"
							onClick={() => setShowModal(false)}
							className="btn-primary"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
