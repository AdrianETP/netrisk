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
import { Chip } from "@mui/material"; 
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";



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

	const renderChip = (value) => {
		// Define colors and icons for different impact levels
		const impactStyles = {
			Crítico: {
				color: "#F31260",
				icon: <ErrorOutlinedIcon color="#fff" fontSize="small" />,
			},
			Alto: {
				color: "#F5A524",
				icon: <WarningRoundedIcon color="#fff" fontSize="small" />,
			},
			Moderado: {
				color: "#7828C8",
				icon: <RemoveCircleOutlineRoundedIcon color="#fff" fontSize="small" />,
			},
			Bajo: {
				color: "#17C964",
				icon: <CheckCircleOutlineRoundedIcon color="#fff" fontSize="small" />,
			},
		};

		// Get the style for the current value
		const impactStyle = impactStyles[value];

		// If no style is found, return a default chip without any specific styling
		if (!impactStyle) {
			return (
				<Chip
					label={value}
					style={{
						backgroundColor: "#9e9e9e", // Default gray color
						color: "#fff",
						fontWeight: "bold",
						padding: "0 8px",
						borderRadius: "16px",
						display: "flex",
						alignItems: "center",
					}}
				/>
			);
		}

		// If a style is found, render the chip with the corresponding color and icon
		return (
			<Chip
				label={value}
				icon={impactStyle.icon}
				style={{
					backgroundColor: impactStyle.color,
					color: "#fff",
					fontWeight: "bold",
					padding: "0 8px",
					borderRadius: "16px",
					display: "flex",
					alignItems: "center",
				}}
			/>
		);
	};


	const renderCell = (item, column) => {
			const isEditable = editableColumns.includes(column.key);
			if (column.key === "impact" && !isEditable) {
				// Render chip for 'impact' column
				return renderChip(item[column.key]);
			}

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
