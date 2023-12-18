import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useMonthPeriod } from '../../context/MonthPeriodContext';
import { Expense, IncomeList } from '../../utils/schema';
import { setLocalStorage } from '../../utils/localApi';

export enum CardHeader {
	'income' = 'INCOME',
	'expense' = 'EXPENSE',
	'remaining' = 'REMAINING',
}

export default function Card({
	header,
	amount,
	setAmount,
}: {
	header: CardHeader;
	amount: number;
	setAmount?: React.Dispatch<React.SetStateAction<number>>;
}) {
	const [editIncome, setEditIncome] = useState(false);
	const { monthSelected } = useMonthPeriod();
	const { expenses, categories, incomes } = useLoaderData() as {
		categories: string[];
		expenses: Expense[];
		incomes: IncomeList[];
	};

	useEffect(() => {
		setEditIncome(false);
	}, [monthSelected]);

	function handleSetIncome(amount: number) {
		const thisMonthIncome = incomes.find(
			(item) => item.month === monthSelected
		);

		if (!incomes || incomes.length < 1 || !thisMonthIncome) {
			incomes.push({
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				amount: amount,
				month: monthSelected,
			});
			setLocalStorage({ expenses, categories, incomes });
			return;
		}

		if (thisMonthIncome.amount === amount) return;

		const indexIncome = incomes.indexOf(thisMonthIncome!);

		if (indexIncome === -1) return;

		incomes[indexIncome].updatedAt = new Date().toISOString();
		incomes[indexIncome].amount = amount;

		setLocalStorage({ expenses, categories, incomes });
	}

	return (
		<div className="w-full my-1 rounded shadow-[0_0_3px_0px_rgb(0,0,0/0.05)] shadow-slate-500 hover:shadow-white transition-shadow divide-y-2 divide-slate-500">
			<div className="flex justify-between items-center px-6 md:px-2 lg:px-6">
				<h2 className="py-3 font-bold">{header}</h2>
				{header === CardHeader.income ? (
					<button
						type={editIncome ? 'submit' : 'button'}
						className="btn-primary px-3 py-1 md:px-3 rounded-lg"
						onClick={() => {
							setEditIncome(!editIncome);
							if (editIncome) handleSetIncome(amount);
						}}
					>
						{editIncome ? 'Save' : 'Edit'}
					</button>
				) : null}
			</div>

			<div
				className={
					editIncome ? 'p-2 md:px-3 md:py-2' : 'px-6 md:px-2 lg:px-6 py-4'
				}
			>
				{editIncome ? (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSetIncome(amount);
							setEditIncome(false);
						}}
						className="w-full inline-flex items-center gap-1"
					>
						<span>IDR</span>
						<input
							type="number"
							name="income"
							id="income"
							value={amount.toString()}
							onChange={(e) => {
								if (!setAmount) return;
								if (!e.target.value) return setAmount(0);
								if (amount === 0 && parseInt(e.target.value) !== 0) {
									return setAmount(parseInt(e.target.value.slice(1)));
								}
								setAmount(parseInt(e.target.value));
							}}
							className="form-input w-28 md:w-full"
							autoFocus
						/>
					</form>
				) : (
					new Intl.NumberFormat(['us-ID', 'us-US'], {
						style: 'currency',
						currency: 'IDR',
						maximumFractionDigits: 0,
					}).format(typeof amount === 'number' ? amount : 0)
				)}
			</div>
		</div>
	);
}
