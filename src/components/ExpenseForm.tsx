import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Expense, LocalDb } from '../utils/schema';
import DropdownInput from './DropdownInput';
import { useRouteLoaderData } from 'react-router-dom';
import { useClickOutsideClose } from '../hooks/useClickOutsideClose';

type FormProps = {
	defaultValues?: Expense;
	type: 'create' | 'edit';
	onSubmit: SubmitHandler<Expense>;
	onDelete?: SubmitHandler<Expense>;
};

export default function ExpenseForm({
	defaultValues,
	type,
	onSubmit,
	onDelete,
}: FormProps) {
	const { categories: kategori, merchant } = useRouteLoaderData(
		'root'
	) as LocalDb;
	const [categories] = useState<string[]>(() => kategori);
	const [showModal, setShowModal] = useState(false);

	const { containerDivRef: confirmModalRef } = useClickOutsideClose({
		setOpenState: setShowModal,
		unlockScroll: unlockScroll,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<Expense>();

	useEffect(() => {
		if (defaultValues) reset(defaultValues);
	}, [defaultValues]);

	function lockScroll() {
		const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
		document.body.style.overflow = 'hidden';
		document.body.style.paddingRight = scrollBarCompensation + 'px';
	}

	function unlockScroll() {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '0px';
	}

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
						autoFocus={type === 'create' ? true : false}
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
					<DropdownInput
						key={'categoryDropdown'}
						register={register}
						setValue={setValue}
						name="category"
						defaultValue={defaultValues?.category}
						dropdownDataList={categories}
					/>
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
					<DropdownInput
						key={'merchantDropdown'}
						register={register}
						setValue={setValue}
						name="merchant"
						defaultValue={defaultValues?.merchant}
						dropdownDataList={merchant}
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
					<select
						{...register('payment', {
							required: 'Please select payment method.',
						})}
						id="expensePayment"
						className="h-8 px-4 rounded-lg "
						defaultValue={defaultValues?.payment || ''}
					>
						<option value="" disabled>
							Select payment
						</option>
						{['Cash', 'Credit'].map((item, index) => (
							<option key={index} value={item}>
								{item}
							</option>
						))}
					</select>
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
					type="submit"
					value="Save"
					onClick={handleSubmit(onSubmit)}
					className="btn-primary w-full py-2"
				/>
				{type === 'edit' && (
					<button
						type="button"
						onClick={() => {
							setShowModal(true);
							lockScroll();
						}}
						className="btn-primary w-full bg-transparent text-red-600 border-red-600 hover:bg-red-400 hover:bg-opacity-5 hover:text-red-600 hover:border-red-600"
					>
						Delete
					</button>
				)}
			</div>

			{/* Modal section */}
			<div
				className={
					`${
						showModal
							? 'fixed inset-0 flex justify-center items-center'
							: 'hidden'
					}` + ' text-center bg-[rgba(0,0,0,0.5)]'
				}
			>
				<div
					ref={confirmModalRef}
					className="relative px-2 md:px-8 py-4 md:py-8 -translate-y-10 bg-neutral-800 rounded-md"
				>
					<p className="text-lg">Are you sure want to delete this record?</p>
					<div className="flex justify-end items-center gap-2 mt-4">
						<button
							type="button"
							className="btn-danger"
							onClick={() => {
								handleSubmit(onDelete!)();
								unlockScroll();
								setShowModal(false);
							}}
						>
							Delete
						</button>
						<button
							type="button"
							onClick={() => {
								unlockScroll();
								setShowModal(false);
							}}
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
