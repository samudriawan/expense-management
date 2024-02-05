import { useEffect, useRef, useState } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Expense } from '../utils/schema';

type Props = {
	name: keyof Expense;
	dropdownDataList: string[];
	defaultValue: string | null | undefined;
	register: UseFormRegister<Expense>;
	setValue: UseFormSetValue<Expense>;
};

function DropdownInput({
	name,
	register,
	dropdownDataList,
	defaultValue,
	setValue,
}: Props) {
	const dropdownContentRef = useRef<HTMLDivElement>(null);
	const dropdownButtonRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [indexSelection, setIndexSelection] = useState(0);
	const [searchValue, setSearchValue] = useState(() =>
		defaultValue ? defaultValue : ''
	);
	const [filterData, setFilterData] = useState<string[]>([]);

	useEffect(() => {
		const handleClickOutsideDropdown = (event: Event) => {
			const target = event.target as Element;
			if (
				dropdownContentRef.current &&
				!dropdownContentRef.current?.contains(target) &&
				target !== dropdownButtonRef.current
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('click', handleClickOutsideDropdown, true);

		return () => {
			document.removeEventListener('click', handleClickOutsideDropdown, true);
		};
	}, [setIsOpen]);

	useEffect(() => {
		const filtered = dropdownDataList.filter((item) => {
			if (!searchValue) return item;
			return item.includes(searchValue);
		});
		setFilterData(filtered);
	}, [dropdownDataList, searchValue]);

	return (
		<div className="relative ">
			<div
				ref={dropdownButtonRef}
				onClick={() => setIsOpen(true)}
				className="w-full"
			>
				<input
					type="text"
					{...register(name)}
					name={name}
					id={`expense${name.charAt(0).toUpperCase().concat(name.slice(1))}`}
					value={searchValue}
					onChange={(e) => {
						setIsOpen(true);
						setSearchValue(e.target.value);
					}}
					placeholder={`Select ${name}`}
					className="form-input"
					onFocus={() => setIsOpen(true)}
					onKeyDown={(e) => {
						switch (e.key) {
							case 'ArrowDown':
								setIsOpen(true);
								if (filterData.length === 1) return setIndexSelection(0);
								if (indexSelection === filterData.length - 1)
									return setIndexSelection(0);
								setIndexSelection((prev) => prev + 1);
								break;

							case 'ArrowUp':
								setIsOpen(true);
								if (filterData.length === 1) return setIndexSelection(0);
								if (indexSelection === 0)
									return setIndexSelection(filterData.length - 1);
								setIndexSelection((prev) => prev - 1);
								break;

							case 'Enter':
								if (filterData.length === 1) {
									setValue(name, filterData[0]);
									setSearchValue(filterData[0]);
									setIsOpen(false);
									return;
								}
								if (filterData.length === 0) {
									setValue(name, searchValue);
									setIsOpen(false);
									return;
								}

								setValue(name, filterData[indexSelection]);
								setSearchValue(filterData[indexSelection]);
								setIsOpen(false);
								break;

							default:
								setIsOpen(false);
								break;
						}
					}}
				/>
			</div>
			<div
				ref={dropdownContentRef}
				className={`absolute w-full p-2 mt-2 rounded bg-neutral-800 border border-neutral-500 ${
					isOpen ? 'block' : 'hidden'
				}`}
			>
				<div
					role="list"
					className="flex flex-col justify-start items-center max-h-48 overflow-auto"
				>
					{filterData.map((item, index) => (
						<div
							key={item}
							className={
								`${
									index === indexSelection ? 'bg-neutral-700 font-bold' : ''
								}` + ' w-full me-auto p-2 cursor-pointer'
							}
							onClick={() => {
								setValue(name, item);
								setSearchValue(item);
								setIsOpen(false);
							}}
							onMouseMove={() => setIndexSelection(index)}
						>
							{item}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
export default DropdownInput;
