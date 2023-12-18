import React, { createContext, useContext, useState } from 'react';

const ctxDefaultValue = {
	monthSelected: new Date().toLocaleDateString('US', {
		month: 'long',
		year: 'numeric',
	}),
	setMonthSelected: (state: string) => {
		state;
	},
};

const MonthPeriodContext = createContext(ctxDefaultValue);

export const useMonthPeriod = () => {
	return useContext(MonthPeriodContext);
};

export function MonthPeriodProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [monthSelected, setMonthSelected] = useState(() =>
		new Date().toLocaleDateString('US', {
			month: 'long',
			year: 'numeric',
		})
	);

	return (
		<MonthPeriodContext.Provider value={{ monthSelected, setMonthSelected }}>
			{children}
		</MonthPeriodContext.Provider>
	);
}
