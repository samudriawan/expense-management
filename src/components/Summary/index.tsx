import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useMonthPeriod } from '../../context/MonthPeriodContext';
import Card, { CardHeader } from './Card';
import { Expense, IncomeList } from '../../utils/schema';

const monthName: { [key: number]: string } = {
	0: 'January',
	1: 'February',
	2: 'March',
	3: 'April',
	4: 'May',
	5: 'June',
	6: 'July',
	7: 'August',
	8: 'September',
	9: 'October',
	10: 'November',
	11: 'December',
};

export default function MonthSummary() {
	const [incomeAmount, setIncomeAmount] = useState(0);
	const [expenseAmount, setExpenseAmount] = useState(0);
	const [monthList, setMonthList] = useState<string[]>([]);
	const expensesData = useLoaderData() as {
		categories: string[];
		expenses: Expense[];
		incomes: IncomeList[];
	};
	const { monthSelected, setMonthSelected } = useMonthPeriod();

	useEffect(() => {
		if (expensesData.incomes) {
			const getThisMonthIncome = expensesData.incomes.find(
				(item) => item.month === monthSelected
			);

			if (!getThisMonthIncome) {
				setIncomeAmount(0);
			} else {
				setIncomeAmount(getThisMonthIncome.amount);
			}
		}
	}, [monthSelected, expensesData.incomes]);

	useEffect(() => {
		setExpenseAmount(
			expensesData.expenses
				.filter(
					(expense) =>
						new Date(expense.createdAt).toLocaleDateString('US', {
							month: 'long',
							year: 'numeric',
						}) === monthSelected
				)
				.map((x) => x.amount)
				.reduce((acc, curr) => acc + curr, 0)
		);
	}, [expensesData, monthSelected]);

	useEffect(() => {
		const yearList = expensesData.expenses
			.sort(
				(a, b) =>
					new Date(a.createdAt).getUTCMonth() -
					new Date(b.createdAt).getUTCMonth()
			)
			.map(
				(item) =>
					`${monthName[new Date(item.createdAt).getMonth()]} ${new Date(
						item.createdAt
					).getFullYear()}`
			);
		setMonthList(Array.from(new Set([...yearList, monthSelected])));
	}, [expensesData.expenses, monthSelected]);

	return (
		<section className="block mb-4">
			<div className="flex items-center mb-4">
				{/* <h2 className="text-2xl me-2" data-testid="header">
					Periode:{' '}
				</h2> */}
				<select
					name="monthYearList"
					id="monthYearList"
					className="select-input w-full h-10"
					value={monthSelected}
					onChange={(e) => setMonthSelected(e.target.value)}
				>
					{monthList.map((item, index) => (
						<option value={item} key={index}>
							{item}
						</option>
					))}
				</select>
			</div>

			<h2 className="text-3xl font-semibold">Summary</h2>

			<div className="flex flex-col md:flex-row gap-2 my-2 px-1 md:justify-around">
				<Card
					header={CardHeader.income}
					amount={incomeAmount}
					setAmount={setIncomeAmount}
				/>
				<Card header={CardHeader.expense} amount={expenseAmount} />
				<Card
					header={CardHeader.remaining}
					amount={incomeAmount - expenseAmount}
				/>
			</div>
		</section>
	);
}
