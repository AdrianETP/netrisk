import { useState } from "react";
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
	
} from "@nextui-org/react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from "@nextui-org/react";


function EditableTable() {
	// Sample data
	const [data, setData] = useState([
		{ id: 1, name: "Item 1", status: "active" },
		{ id: 2, name: "Item 2", status: "inactive" },
		{ id: 3, name: "Item 3", status: "active" },
	]);

	// Dropdown options
	const statusOptions = ["active", "inactive", "pending"];

	// Handle dropdown change
	const handleStatusChange = (id, newStatus) => {
		setData((prevData) =>
			prevData.map((item) =>
				item.id === id ? { ...item, status: newStatus } : item
			)
		);
	};

	return (
		<Table
			aria-label="Editable Table"
			css={{ height: "auto", minWidth: "100%" }}
		>
			<TableHeader>
				<TableColumn>Name</TableColumn>
				<TableColumn>Status</TableColumn>
			</TableHeader>
			<TableBody>
				{data.map((item) => (
					<TableRow key={item.id}>
						<TableCell>
							<p>{item.name}</p>
						</TableCell>
						<TableCell>
							<Dropdown>
								<DropdownTrigger>
									<Button variant="bordered" className="capitalize">
										{item.status}
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									onAction={(key) => handleStatusChange(item.id, key)}
								>
									{statusOptions.map((option) => (
										<DropdownItem key={option}>{option}</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export default EditableTable;
