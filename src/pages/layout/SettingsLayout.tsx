import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function SettingsLayout() {
	const [activeLink, setActiveLink] = useState('');
	const { pathname } = useLocation();

	useEffect(() => {
		setActiveLink(pathname.split('/').at(-1)!);
	}, [pathname]);

	return (
		<div className="grid auto-cols-auto md:grid-cols-4 gap-4 md:grid-flow-col">
			<section className="col-start-1 md:pe-6">
				<div className="ms-4 me-2">
					<h1 className="mt-1 mb-6 text-lg font-bold">Settings</h1>
					<ul>
						<li
							className={`relative rounded hover:bg-neutral-700 ${
								activeLink === 'categories' ? 'active-link' : ''
							}`}
						>
							<Link
								to={'/settings/categories'}
								className="relative block px-2 py-1.5"
							>
								Categories
							</Link>
						</li>
						<li
							className={`relative rounded hover:bg-neutral-700  ${
								activeLink === 'merchants' ? 'active-link' : ''
							}`}
						>
							<Link
								to={'/settings/merchants'}
								className="relative block px-2 py-1.5"
							>
								Merchants
							</Link>
						</li>
					</ul>
				</div>
			</section>
			<section className="md:pe-4 col-start-1 md:col-start-2 md:col-span-3 w-full">
				<Outlet />
			</section>
		</div>
	);
}
