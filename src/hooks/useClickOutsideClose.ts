import { useEffect, useRef } from 'react';

type Props = {
	setOpenState: (state: boolean) => void;
	unlockScroll?: () => void;
};

export function useClickOutsideClose({ setOpenState, unlockScroll }: Props) {
	const containerDivRef = useRef<HTMLDivElement>(null);
	const toggleButtnRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleClickOutsideModal = (event: Event) => {
			const target = event.target as Element;
			if (
				containerDivRef.current &&
				!containerDivRef.current?.contains(target) &&
				!toggleButtnRef.current?.contains(target)
			) {
				setOpenState(false);
				unlockScroll && unlockScroll();
			}
		};

		document.addEventListener('click', handleClickOutsideModal, true);

		return () => {
			document.removeEventListener('click', handleClickOutsideModal, true);
		};
	}, [setOpenState]);

	return { containerDivRef, toggleButtnRef };
}
