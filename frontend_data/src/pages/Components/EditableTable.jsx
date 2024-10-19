import { useState } from "react";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Select,
	SelectItem,
	Modal,
	Button,
	Textarea,
	useDisclosure,
} from "@nextui-org/react";
import {
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@nextui-org/modal";
import "./EditableTable.css";
import { Chip, IconButton, InputAdornment, TextField } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import AddIcon from "@mui/icons-material/Add"; // Icono para agregar
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";


import {
	Info as InfoIcon,
	NetworkWifi as NetworkWifiIcon,
} from "@mui/icons-material";

import { Typography, Box, Grid } from "@mui/material";

function EditableTable({
	columns,
	initialData,
	editableColumns,
	dropdownOptions,
}) {
	const [data, setData] = useState(initialData);
	const [hoveredCell, setHoveredCell] = useState(null); // Estado para controlar la celda activa
	const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Using useDisclosure for modal
	const [selectedItem, setSelectedItem] = useState(null);
	const [searchQuery, setSearchQuery] = useState(""); // New state for search query

	const handleSelectChange = (rowId, columnKey, newValue) => {
		setData((prevData) =>
			prevData.map((item) =>
				item.id === rowId ? { ...item, [columnKey]: newValue } : item
			)
		);
	};

	const handleCopyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
	};

	const handleModalOpen = (item) => {
		setSelectedItem(item);
		onOpen(); // Open the modal
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
		const cellValue = item[column.key];

		if (column.key === "impact") {
			// Render chip for 'impact' column
			return renderChip(item[column.key]);
		}

		if (isEditable) {
			// Check if the column should render a modal button instead of a dropdown
			if (column.key === "desc") {
				// Replace with the actual key for the column
				return (
					<div style={{ display: "flex", alignItems: "center" }}>
						<Button
							fullWidth
							size="sm"
							variant="bordered"
							className="border-[#0DD4CE] text-[#0DD4CE] hover:text-[#2D2D2D] hover:bg-[#0DD4CE]"
							onClick={() => handleModalOpen(item)}
						>
							{item.desc ? (
								<>
									Ver
									<VisibilityRoundedIcon
										style={{ height: "auto", width: "15px" }}
									/>
								</>
							) : (
								<>
									Agregar
									<AddIcon style={{}} />
								</>
							)}
						</Button>
					</div>
				);
			}

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

		return (
			<div
				onMouseEnter={() => setHoveredCell(item.id + column.key)}
				onMouseLeave={() => setHoveredCell(null)}
				style={{ display: "flex", alignItems: "center" }} // Flexbox layout for alignment
			>
				<p style={{ margin: 0 }}>{cellValue}</p>
				<div
					style={{
						width: "24px", // Reserve space for the icon
						marginLeft: "8px",
						visibility:
							hoveredCell === item.id + column.key ? "visible" : "hidden", // Control visibility
					}}
				>
					<IconButton
						onClick={() => handleCopyToClipboard(cellValue)}
						size="small"
					>
						<ContentCopyIcon fontSize="small" />
					</IconButton>
				</div>
			</div>
		);
	};

	// Filter data based on the search query
	const filteredData = data.filter((item) =>
		columns.some((column) =>
			item[column.key]
				.toString()
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		)
	);

	return (
		<>
			<div style={{ position: "relative", width: "100%" }}>
				{" "}
				{/* Relative positioning for the container */}
				<TextField
					placeholder="Buscar"
					value={searchQuery} // Set the value of the input to the searchQuery state
					onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchRoundedIcon />
							</InputAdornment>
						),
						style: {
							borderRadius: 12,
							position: "absolute", // Absolute positioning for the search input
							bottom: 10,
							left: "840px",
							width: "200px", // Adjust width as needed
						},
					}}
					sx={{
						height: "40px", // Adjust the height as needed
						"& .MuiOutlinedInput-root": {
							height: "100%", // Ensure the input uses full height
							"& fieldset": {
								borderWidth: 2,
								borderColor: "#A1A1AA",
							},
							"&:hover fieldset": {
								borderColor: "#f6f6f6",
							},
							"&.Mui-focused fieldset": {
								borderColor: "#f6f6f6",
							},
						},
						"& .MuiInputBase-input": {
							padding: "12px", // Adjust the padding to center text
						},
					}}
				/>
				<Table
					aria-label="Editable Table"
					isHeaderSticky
					isCompact
					classNames={{
						wrapper: "bg-[#2D2D2D]",
						th: "bg-[#404040] text-color-[#F6F6F6] font-semibold text-xs",
						td: "font-normal text-xs",
						base: "max-h-[240px] overflow-auto",
						table: "min-h-[120px]",
					}}
				>
					<TableHeader>
						{columns.map((column) => (
							<TableColumn key={column.key}>{column.label}</TableColumn>
						))}
					</TableHeader>
					<TableBody>
						{filteredData.map((item) => (
							<TableRow key={item.id}>
								{columns.map((column) => (
									<TableCell key={column.key}>
										{renderCell(item, column)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
				<Modal
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					radius="lg"
					classNames={{
						base: "bg-[#202020] border-[#41434A] border-2", // Added z-index to the modal
						backdrop: "",
					}}
				>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1 pb-0">
									Descripción - {selectedItem["idTabla"]}
								</ModalHeader>
								<ModalBody>
									{selectedItem && (
										<div
											style={{
												padding: "16px",
												borderRadius: "8px",
												display: "flex",
												flexDirection: "column",
												gap: "16px",
											}}
										>
											<Typography variant="body2" sx={{ color: "#bdbdbd" }}>
												Agregar una descripción es importante para el proceso de
												categorización de NetRisk, ya que ayuda a comprender el
												contexto y el impacto potencial de cada dispositivo en
												la red.
											</Typography>
											<Grid container spacing={2}>
												{/* Display IP */}
												<Grid item xs={12} sm={6}>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: "14px",
															padding: "8px",
															borderRadius: "10px",
															borderColor: "#41434A",
															borderWidth: "1px",
														}}
													>
														<NetworkWifiIcon
															style={{
																fontSize: "20px",
																color: "#f6f6f6",
																marginInline: "8px",
															}}
														/>
														<Box sx={{ flex: 1 }}>
															<Typography
																variant="body2"
																sx={{
																	fontWeight: "bold",
																	color: "#e0e0e0",
																	marginBottom: "4px",
																}}
															>
																IP
															</Typography>
															<Typography
																variant="body2"
																sx={{ color: "#bdbdbd", margin: 0 }}
															>
																{selectedItem["ip"]}
															</Typography>
														</Box>
													</Box>
												</Grid>
												{/* Display Device Type */}
												<Grid item xs={12} sm={6}>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: "8px",
															padding: "8px",
															borderRadius: "10px",
															borderColor: "#41434A",
															borderWidth: "1px",
														}}
													>
														<InfoIcon
															style={{
																fontSize: "20px",
																color: "#f6f6f6",
																marginInline: "8px",
															}}
														/>
														<Box sx={{ flex: 1 }}>
															<Typography
																variant="body2"
																sx={{
																	fontWeight: "bold",
																	color: "#e0e0e0",
																	marginBottom: "4px",
																}}
															>
																Dispositivo
															</Typography>
															<Typography
																variant="body2"
																sx={{ color: "#bdbdbd", margin: 0 }}
															>
																{selectedItem["device"]}{" "}
																{/* Adjust this key to match your data structure */}
															</Typography>
														</Box>
													</Box>
												</Grid>
											</Grid>
											{/* Show description field */}
											<Box
												sx={{
													padding: "8px",
													borderRadius: "8px",
													boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
												}}
											>
												<Typography
													variant="body2"
													sx={{
														fontWeight: "bold",
														color: "#e0e0e0",
														marginBottom: "4px",
													}}
												>
													Descripción
												</Typography>
												<Textarea
													clearable
													bordered
													fullWidth
													placeholder="Agregar descripción"
													value={selectedItem["desc"]}
													onChange={(e) =>
														setSelectedItem({
															...selectedItem,
															desc: e.target.value,
														})
													}
													rows={4}
													style={{
														fontSize: "14px",
														borderColor: "#616161",
													}}
												/>
											</Box>
										</div>
									)}
								</ModalBody>

								<ModalFooter>
									<Button
										fullWidth
										color="default"
										variant="light"
										onPress={onClose}
									>
										Cancelar
									</Button>
									<Button
										fullWidth
										variant="bordered"
										className="text-[#0DD4CE] border-[#0DD4CE] border-2 hover:text-[#2D2D2D] hover:bg-[#0DD4CE]"
										onPress={() => {
											setData((prevData) =>
												prevData.map((item) =>
													item.id === selectedItem.id ? selectedItem : item
												)
											);
											onClose(); // Close the modal after saving
										}}
									>
										<b>Guardar</b>
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			</div>
		</>
	);
}

export default EditableTable;
