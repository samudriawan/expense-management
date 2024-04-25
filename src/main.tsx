import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import SharedLayout from './pages/layout/SharedLayout.tsx';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import NewExpense from './pages/NewExpense.tsx';
import EditExpense from './pages/EditExpense.tsx';
import { MonthPeriodProvider } from './context/MonthPeriodContext.tsx';
import {
	AppLoader,
	editExpenseAction,
	editExpenseLoader,
	newExpenseAction,
	settingsAction,
	settingsLoader,
} from './utils/router.ts';
import SettingsLayout from './pages/layout/SettingsLayout.tsx';
import Merchants from './pages/settings/Merchants.tsx';
import Categories from './pages/settings/Categories.tsx';

export const RouterPaths = {
	createExpense: '/create-expense',
	editExpense: '/:expenseName/edit',
	settings: {
		root: '/settings',
		categories: '/settings/categories',
		merchants: '/settings/merchants',
	},
} as const;

const router = createBrowserRouter([
	{
		path: '/',
		element: <SharedLayout />,
		id: 'root',
		loader: AppLoader,
		children: [
			{
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <App />,
					},
					{
						path: RouterPaths.createExpense,
						element: <NewExpense />,
						action: newExpenseAction,
					},
					{
						path: RouterPaths.editExpense,
						element: <EditExpense />,
						loader: editExpenseLoader,
						action: editExpenseAction,
					},
					{
						path: RouterPaths.settings.root,
						element: <SettingsLayout />,
						id: 'settings',
						loader: settingsLoader,
						children: [
							{
								index: true,
								element: <Categories />,
								action: settingsAction,
							},
							{
								path: RouterPaths.settings.categories,
								element: <Categories />,
								action: settingsAction,
							},
							{
								path: RouterPaths.settings.merchants,
								element: <Merchants />,
								action: settingsAction,
							},
						],
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
