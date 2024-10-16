import { useState } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Select,
	SelectItem,
} from "@nextui-org/react";
import "./EditableTable.css";

function EditableTable({
	columns,
	initialData,
	editableColumns,
	dropdownOptions,
}) {
	const [data, setData] = useState(initialData);

	const handleSelectChange = (rowId, columnKey, newValue) => {
		setData((prevData) =>
			prevData.map((item) =>
				item.id === rowId ? { ...item, [columnKey]: newValue } : item
			)
		);
	};

	const renderCell = (item, column) => {
		const isEditable = editableColumns.includes(column.key);
		if (isEditable) {
			const options = dropdownOptions[column.key] || [];
			return (
				<Select
					selectedKey={item[column.key]}
					onChange={(key) => handleSelectChange(item.id, column.key, key)}
					className="capitalize"
				>
					{options.map((option) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</Select>
			);
		}
		return <p>{item[column.key]}</p>;
	};

	return (
		<Table
			aria-label="Editable Table"
			isHeaderSticky
			isCompact
			classNames={{
				wrapper: "bg-[#2D2D2D]",
				th: "bg-[#404040] text-color-[#F6F6F6] font-semibold text-xs",
				td: "font-normal text-xs",
				base: "max-h-[220px] overflow-auto",
				table: "min-h-[120px]",
			}}
		>
			<TableHeader>
				{columns.map((column) => (
					<TableColumn key={column.key}>{column.label}</TableColumn>
				))}
			</TableHeader>
			<TableBody>
				{data.map((item) => (
					<TableRow key={item.id}>
						{columns.map((column) => (
							<TableCell key={column.key}>{renderCell(item, column)}</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default EditableTable;
