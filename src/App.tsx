import { Link } from 'react-router-dom';
import ExpenseDetail from './components/ExpenseDetail';
import MonthSummary from './components/Summary';

function App() {
	return (
		<>
			<MonthSummary />

			<Link
				to="/create-expense"
				className="btn-primary md:my-2 w-full md:w-fit"
				data-testid="create-new-link"
				aria-label="New Entry"
				title="Create New Entry"
			>
				New Entry
			</Link>

			<ExpenseDetail />
		</>
	);
}

export default App;
