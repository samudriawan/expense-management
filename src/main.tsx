import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import SharedLayout from './SharedLayout.tsx';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import NewExpense from './pages/NewExpense.tsx';
import EditExpense from './pages/EditExpense.tsx';
import { MonthPeriodProvider } from './context/MonthPeriodContext.tsx';
import {
	AppLoader,
	editExpenseAction,
	editExpenseLoader,
	newExpenseAction,
} from './utils/router.ts';

export const RouterPaths = {
	expense: '/:expenseName/edit',
} as const;

const router = createBrowserRouter([
	{
		path: '/',
		element: <SharedLayout />,

		children: [
			{
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <App />,
						loader: AppLoader,
					},
					{
						path: '/create-expense',
						element: <NewExpense />,
						loader: AppLoader,
						action: newExpenseAction,
					},
					{
						path: RouterPaths.expense,
						element: <EditExpense />,
						loader: editExpenseLoader,
						action: editExpenseAction,
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<MonthPeriodProvider>
			<RouterProvider router={router} />
		</MonthPeriodProvider>
	</React.StrictMode>
);
