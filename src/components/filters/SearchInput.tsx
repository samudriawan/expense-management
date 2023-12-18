import { useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

type Props = {
	searchText: string;
	setSearchText: (text: string) => void;
};

export default function SearchInput({ searchText, setSearchText }: Props) {
	const inputSearchRef = useRef<HTMLInputElement>(null);

	return (
		<div className="relative w-full">
			<input
				ref={inputSearchRef}
				type="search"
				name="search"
				id="search"
				value={searchText}
				onChange={(e) => setSearchText(e.currentTarget.value.toLowerCase())}
				placeholder="Search expense..."
				className="my-3 bg-neutral-800 appearance-none border-2 border-transparent rounded w-full h-10 py-1 px-2 text-white leading-tight focus:outline-none focus:bg-neutral-700 focus:border-2 focus:border-[#035bff]"
			/>
			<button
				type="button"
				onClick={() => {
					setSearchText('');
					inputSearchRef.current?.focus();
				}}
				className={
					searchText
						? 'absolute top-0 bottom-0 right-0 my-3 px-3 rounded-full hover:bg-[rgba(255,255,255,0.1)]'
						: 'hidden'
				}
			>
				<AiOutlineClose />
			</button>
		</div>
	);
}
