import { Link, Outlet } from 'react-router-dom';

export default function SharedLayout() {
	return (
		<>
			<div className="z-50 w-full py-3 px-4 align-middle bg-black">
				<nav className="flex items-center justify-between w-full md:w-9/12 mx-auto md:px-2">
					<Link to="/">
						<h1 className="text-lg font-bold" data-testid="nav-logo">
							Expense
						</h1>
					</Link>
				</nav>
			</div>
			<main className="text-white bg-neutral-900 p-4 md:w-9/12 mx-auto">
				<Outlet />
			</main>
		</>
	);
}
