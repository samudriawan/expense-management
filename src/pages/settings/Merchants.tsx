import { useLocation, useRouteLoaderData, useSubmit } from 'react-router-dom';
import { Expense } from '../../utils/schema';
import { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { FaCheck, FaRegTrashCan } from 'react-icons/fa6';
import { GoPlus } from 'react-icons/go';

type FormValues = {
	merchant: string;
};
type FormMerchantValues = {
	merchants: { name: string }[];
};

export default function Merchants() {
	const { expenses, merchant } = useRouteLoaderData('settings') as {
		expenses: Expense[];
		merchant: string[];
	};
	const [merchantsData, setMerchantsData] = useState(() => merchant);
	const [createInputShow, setCreateInputShow] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [associatedMerchant, setAssociatedMerchant] = useState<string[]>(() =>
		Array.from(
			new Set(expenses.map((item) => (item.merchant ? item.merchant : '')))
		)
	);
	const routerSubmit = useSubmit();

	const {
		register: registerNewEntry,
		handleSubmit: handleSubmitNewEntry,
		resetField,
	} = useForm<FormValues>();

	const { handleSubmit, control } = useForm<FormMerchantValues>({
		defaultValues: (() => {
			const formCategory: FormMerchantValues = { merchants: [] };
			if (!merchant) return undefined;
			merchant.forEach((item) => {
				formCategory.merchants.push({ name: item });
			});
			return formCategory;
		})(),
	});

	const { fields, append, update, remove } = useFieldArray({
		control,
		name: 'merchants',
	});

	const location = useLocation();

	useEffect(() => {
		setMerchantsData(merchant);
		setAssociatedMerchant(
			Array.from(
				new Set(expenses.map((item) => (item.merchant ? item.merchant : '')))
			)
		);
	}, [expenses, merchant]);

	const onCreateNew: SubmitHandler<FormValues> = (data) => {
		const addAction = {
			data: data.merchant,
			action: 'create_merchant',
			callback: location.pathname,
		};

		if (data.merchant && !merchant.includes(data.merchant)) {
			append({ name: data.merchant });
			routerSubmit(addAction, { method: 'post' });
			resetField('merchant');
			setErrorMsg('');
			setCreateInputShow(false);
			return;
		}

		if (!data.merchant) setErrorMsg(`Merchant name cannot be blank.`);

		if (merchant.includes(data.merchant))
			setErrorMsg(`Merchant "${data.merchant}" already exists.`);
	};

	const onDelete: SubmitHandler<FormMerchantValues> = (data) => {
		const convertFormValues = data.merchants.map((item) => {
			return item.name.trim();
		});

		const deletedValue = merchant.filter(
			(item) => !convertFormValues.includes(item)
		);

		const addAction = {
			data: JSON.stringify(convertFormValues),
			index: merchant.findIndex((element) => element === deletedValue.at(-1)),
			action: 'delete_merchant',
			callback: location.pathname,
		};

		routerSubmit(addAction, { method: 'post' });
		resetField('merchant');
		setErrorMsg('');
		setCreateInputShow(false);
	};

	const onEdit: SubmitHandler<FormMerchantValues> = (data) => {
		const convertFormValues = data.merchants.map((item) => {
			return item.name.trim();
		});

		const changedValue = merchant.filter(
			(item) => !convertFormValues.includes(item)
		);

		const addAction = {
			data: JSON.stringify(convertFormValues),
			index: merchant.findIndex((item) => item === changedValue[0]),
			action: 'edit_merchant',
			callback: location.pathname,
		};

		routerSubmit(addAction, { method: 'post' });
	};

	return (
		<div>
			<h1 className="mt-1 mb-6 text-lg font-bold">Merchants</h1>
			<div>
				{createInputShow ? (
					<form
						method="post"
						className="py-2 border border-neutral-600 rounded-lg overflow-hidden"
					>
						<div className="pt-2 pb-4 border-b-[1px] border-b-neutral-600">
							<h3 className="text-lg px-3 font-semibold">New Merchant</h3>
						</div>
						{errorMsg ? (
							<div className="m-3 p-2 bg-red-200 rounded overflow-hidden">
								<span className="text-red-900 italic">{errorMsg}</span>
							</div>
						) : null}
						<div className="px-3 py-2 my-2 flex flex-col gap-4 w-full">
							<div className="flex flex-col gap-2">
								<label htmlFor="expenseCreateDate" className="text-red-400">
									Merchant Name *
								</label>
								<input
									id="newMerchantName"
									{...registerNewEntry('merchant')}
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
										resetField('merchant');
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
							New Merchant
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
									defaultValue={field.name}
									onChange={(e) =>
										setMerchantsData((prev) => {
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
										update(index, { name: merchantsData[index].trim() });
										handleSubmit(onEdit)();
									}}
									className="btn-primary w-fit disabled:cursor-not-allowed disabled:hover:bg-gray-500 disabled:bg-gray-500 disabled:text-white disabled:border-transparent"
									title="Save"
									disabled={
										merchant[index] ===
										(merchantsData[index]
											? merchantsData[index].trim()
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
										associatedMerchant.includes(field.name)
											? 'Has associated in expense'
											: 'Delete'
									}
									disabled={associatedMerchant.includes(field.name)}
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
