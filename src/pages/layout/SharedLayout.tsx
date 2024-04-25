import { Link, Outlet, ScrollRestoration } from 'react-router-dom';
import { BsGear } from 'react-icons/bs';

export default function SharedLayout() {
	return (
		<>
			<div className="fixed z-50 w-full py-3 px-4 align-middle bg-black">
				<nav className="grid grid-cols-3 w-full mx-auto md:px-2">
					<Link to="/" className="col-start-2 mx-auto">
						<h1 className="text-lg font-bold" data-testid="nav-logo">
							Expense
						</h1>
					</Link>
					<Link
						to="/settings/categories"
						className="flex items-center justify-center ms-auto px-1"
					>
						<BsGear size="1.2rem" />
					</Link>
				</nav>
			</div>
			<main className="bg-neutral-900 md:w-full mx-auto">
				<ScrollRestoration />
				<section className="main-content">
					<Outlet />
				</section>
			</main>
		</>
	);
}
