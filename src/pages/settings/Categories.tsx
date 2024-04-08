import { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useRouteLoaderData, useSubmit } from 'react-router-dom';
import { FaCheck, FaRegTrashCan } from 'react-icons/fa6';
import { Expense } from '../../utils/schema';
import { GoPlus } from 'react-icons/go';

type FormValues = {
	category: string;
};
type FormCategoryValues = {
	categories: { value: string }[];
};

export default function Categories() {
	const { expenses, categories } = useRouteLoaderData('settings') as {
		expenses: Expense[];
		categories: string[];
	};
	const [categoryValues, setCategoryValues] = useState<string[]>(
		() => categories
	);
	const [associatedCategory, setAssociatedCategory] = useState<string[]>(() =>
		Array.from(new Set(expenses.map((item) => item.category)))
	);
	const [createInputShow, setCreateInputShow] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const routerSubmit = useSubmit();

	const {
		register: registerNewEntry,
		handleSubmit: handleSubmitNewEntry,
		resetField,
	} = useForm<FormValues>();

	const { handleSubmit, control } = useForm<FormCategoryValues>({
		defaultValues: (() => {
			const formCategory: FormCategoryValues = { categories: [] };
			categories.forEach((item) => {
				formCategory.categories.push({ value: item });
			});
			return formCategory;
		})(),
	});

	const { fields, append, update, remove } = useFieldArray({
		control,
		name: 'categories',
	});

	const location = useLocation();

	useEffect(() => {
		setCategoryValues(categories);
		setAssociatedCategory(
			Array.from(new Set(expenses.map((item) => item.category)))
		);
	}, [categories, expenses]);

	const onCreateNew: SubmitHandler<FormValues> = (data) => {
		const addAction = {
			data: data.category,
			action: 'create_category',
			callback: location.pathname,
		};

		if (data.category && !categories.includes(data.category)) {
			append({ value: data.category });
			routerSubmit(addAction, { method: 'post' });
			resetField('category');
			setErrorMsg('');
			setCreateInputShow(false);
			return;
		}

		if (!data.category) setErrorMsg(`Category name cannot be blank.`);

		if (categories.includes(data.category))
			setErrorMsg(`Category "${data.category}" already exists.`);
	};

	const onDelete: SubmitHandler<FormCategoryValues> = (data) => {
		const convertFormValues = data.categories.map((item) => {
			return item.value.trim();
		});

		const deletedValue = categories.filter(
			(item) => !convertFormValues.includes(item)
		);

		const addAction = {
			data: JSON.stringify(convertFormValues),
			index: categories.findIndex((element) => element === deletedValue.at(-1)),
			action: 'delete_category',
			callback: location.pathname,
		};

		routerSubmit(addAction, { method: 'post' });
		resetField('category');
		setErrorMsg('');
		setCreateInputShow(false);
	};

	const onEdit: SubmitHandler<FormCategoryValues> = (data) => {
		const convertFormValues = data.categories.map((item) => {
			return item.value.trim();
		});

		const changedValue = categories.filter(
			(item) => !convertFormValues.includes(item)
		);

		const addAction = {
			data: JSON.stringify(convertFormValues),
			index: categories.findIndex((item) => item === changedValue[0]),
			action: 'edit_category',
			callback: location.pathname,
		};

		routerSubmit(addAction, { method: 'post' });
	};

	return (
		<div>
			<h1 className="mt-1 mb-6 text-lg font-bold">Categories</h1>
			<div>
				{createInputShow ? (
					<form
						method="post"
						className="py-2 border border-neutral-600 rounded-lg overflow-hidden"
					>
						<div className="pt-2 pb-4 border-b-[1px] border-b-neutral-600">
							<h3 className="text-lg px-3 font-semibold">New Category</h3>
						</div>
						{errorMsg ? (
							<div className="m-3 p-2 bg-red-200 rounded overflow-hidden">
								<span className="text-red-900 italic">{errorMsg}</span>
							</div>
						) : null}
						<div className="px-3 py-2 my-2 flex flex-col gap-4 w-full">
							<div className="flex flex-col gap-2">
								<label htmlFor="expenseCreateDate" className="text-red-400">
									Category Name *
								</label>
								<input
									id="newMerchantName"
									{...registerNewEntry('category')}
									className="form-input w-full"
									autoFocus
								/>
							</div>
							<div className="flex gap-2 mt-2">
								<button
									type="submit"
									className="btn-primary w-fit px-3"
									onClick={handleSubmitNewEntry(onCreateNew)}
								>
									Save
								</button>
								<button
									type="submit"
									className="btn-primary w-fit bg-transparent border-neutral-600"
									onClick={() => {
										resetField('category');
										setCreateInputShow(false);
										setErrorMsg('');
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					</form>
				) : (
					<button
						type="button"
						className="btn-primary px-2"
						onClick={() => setCreateInputShow(true)}
					>
						<span className="flex items-center justify-center gap-1">
							<GoPlus />
							New Category
						</span>
					</button>
				)}
			</div>
			<form>
				<div className="flex flex-col gap-4 w-full my-4">
					{fields.map((field, index) => {
						return (
							<div key={field.id} className="flex gap-2">
								<input
									type="text"
									defaultValue={field.value}
									onChange={(e) =>
										setCategoryValues((prev) => {
											const newState = [...prev];
											newState[index] = e.target.value;
											return newState;
										})
									}
									className="form-input"
								/>

								<button
									type="button"
									name="action"
									value="edit"
									onClick={() => {
										update(index, { value: categoryValues[index].trim() });
										handleSubmit(onEdit)();
									}}
									className="btn-primary w-fit disabled:cursor-not-allowed disabled:hover:bg-gray-500 disabled:bg-gray-500 disabled:text-white disabled:border-transparent"
									title="Save"
									disabled={
										categories[index] ===
										(categoryValues[index]
											? categoryValues[index].trim()
											: undefined)
									}
								>
									<FaCheck />
								</button>
								<button
									type="button"
									onClick={() => {
										remove(index);
										handleSubmit(onDelete)();
									}}
									className="btn-primary w-fit disabled:cursor-not-allowed disabled:hover:bg-gray-500 disabled:bg-gray-500 disabled:text-white disabled:border-transparent"
									title={
										associatedCategory.includes(field.value)
											? 'Has associated in expense'
											: 'Delete'
									}
									disabled={associatedCategory.includes(field.value)}
								>
									<FaRegTrashCan />
								</button>
							</div>
						);
					})}
				</div>
			</form>
		</div>
	);
}
