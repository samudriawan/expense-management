import { z } from 'zod';

export const expenseSchema = z.object({
	// id: z.number().positive().int(),
	id: z.string().uuid(),
	name: z
		.string()
		.min(1, { message: 'Expense name is required' })
		.max(50)
		.trim(),
	category: z.string(),
	createdAt: z.string().datetime(),
	amount: z.number().positive().int(),
	note: z.string().nullish(),
});

export const incomeSchema = z.object({
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime().nullish(),
	month: z.string(),
	amount: z.number().int(),
});

export type Expense = z.infer<typeof expenseSchema>;
export type IncomeList = z.infer<typeof incomeSchema>;

export interface LocalDb {
	expenses: Expense[];
	categories: string[];
	incomes: IncomeList[];
}
