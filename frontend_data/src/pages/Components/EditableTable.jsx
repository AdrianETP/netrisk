import { useState, useEffect } from "react";
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
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

import {
	Info as InfoIcon,
	NetworkWifi as NetworkWifiIcon,
} from "@mui/icons-material";

import { Typography, Box, Grid } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";


function EditableTable({
	columns,
	initialData,
	editableColumns,
	dropdownOptions,
	baseHeight = "max-h-[240px]", // Set default value here
}) {
	const [data, setData] = useState(initialData);
	const [hoveredCell, setHoveredCell] = useState(null); // Estado para controlar la celda activa
	const modal1 = useDisclosure();
	const modal2 = useDisclosure();
	const modal3 = useDisclosure();
	const [selectedItem, setSelectedItem] = useState(null);
	const [searchQuery, setSearchQuery] = useState(""); // New state for search query
	const [isCopied, setIsCopied] = useState(false); // State to track if the value is copied

	useEffect(() => {
		setData(initialData);
	}, [initialData]);

	const stateStyles = {
		Implementado: {
			icon: (
				<CheckCircleOutlineRoundedIcon fontSize="14px" htmlColor="#17C964" />
			),
		},
		Cumplido: {
			icon: (
				<CheckCircleOutlineRoundedIcon fontSize="14px" htmlColor="#17C964" />
			),
		},
		Completada: {
			icon: (
				<CheckCircleOutlineRoundedIcon fontSize="14px" htmlColor="#17C964" />
			),
		},
		"En proceso": {
			icon: <AccessTimeRoundedIcon fontSize="14px" htmlColor="#F5A524" />,
		},
		"En revisión": {
			icon: <VisibilityOutlinedIcon fontSize="14px" htmlColor="#006FEE" />,
		},
		"Sin implementar": {
			icon: <HighlightOffRoundedIcon fontSize="14px" htmlColor="#F31260" />,
		},
		"Sin cumplir": {
			icon: <HighlightOffRoundedIcon fontSize="14px" htmlColor="#F31260" />,
		},
		Faltante: {
			icon: <HighlightOffRoundedIcon fontSize="14px" htmlColor="#F31260" />,
		},
		Excluido: {
			icon: (
				<RemoveCircleOutlineRoundedIcon fontSize="14px" htmlColor="#E4E4E7" />
			),
		},
	};

	const handleSelectChange = (rowId, columnKey, newValue) => {
		setData((prevData) =>
			prevData.map((item) =>
				item.id === rowId ? { ...item, [columnKey]: newValue } : item
			)
		);
	};

	const handleCopyToClipboard = (value) => {
		navigator.clipboard.writeText(value).then(() => {
			setIsCopied(true); // Set copied state to true

			// Reset the icon after 2 seconds
			setTimeout(() => {
				setIsCopied(false);
			}, 1000);
		});
	};

	const handleModalOpen = (item) => {
		setSelectedItem(item);
		modal1.onOpen(); // Open the modal
	};

	const handleOpenModal2 = () => {
		modal2.onOpen();
	};

	const handleOpenModal3 = (item) => {
		setSelectedItem(item);
		modal3.onOpen();
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

		if (column.key == "estado") {
			return (
				<div className="flex flex-row items-center gap-2">
					{stateStyles[item[column.key]]?.icon}
					<p>{item[column.key]}</p>
				</div>
			);
		}
			if (isEditable) {
				// Check if the column should render a modal button instead of a dropdown
				if (column.key === "pendingActions") {
					return (
						<div style={{ display: "flex", alignItems: "center" }}>
							<Button
								fullWidth
								size="sm"
								variant="bordered"
								className="border-[#0DD4CE] text-[#0DD4CE] hover:text-[#2D2D2D] hover:bg-[#0DD4CE]"
								onClick={() => handleOpenModal3(item)}
							>
								{item.pendingActions ? (
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
						selectedKey={
							(stateStyles[item[column.key]]?.icon || null) + item[column.key]
						}
						placeholder={item[column.key] || "Seleccionar"}
						size="sm"
						onChange={(key) => handleSelectChange(item.id, column.key, key)}
						className="capitalize"
						startContent={stateStyles[item[column.key]]?.icon || null}
					>
						{options.map((option) => (
							<SelectItem
								key={option}
								value={option}
								startContent={stateStyles[option]?.icon || null}
							>
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
						transition: "opacity 0.3s ease", // Smooth transition for visibility
					}}
				>
					<IconButton
						onClick={() => handleCopyToClipboard(cellValue)}
						size="small"
					>
						{isCopied ? (
							<CheckRoundedIcon
								fontSize="small"
								style={{ transition: "opacity 0.3s ease" }}
							/> // Check icon with animation
						) : (
							<ContentCopyIcon fontSize="small" />
						)}
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
						td: "font-normal text-xs max-w-[180px]",
						base: `${baseHeight} overflow-auto`, // Corrected string concatenation
						table: "min-h-[120px] ",
					}}
				>
					<TableHeader>
						{columns.map((column) => (
							<TableColumn key={column.key}>
								{column.label}
								{column.key === "potentialLoss" && (
									<span
										onClick={handleOpenModal2}
										style={{ cursor: "pointer", marginLeft: "8px" }}
									>
										<HelpOutlineRoundedIcon
											fontSize="small"
											style={{ marginBottom: "2px" }}
										/>
									</span>
								)}
							</TableColumn>
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
					isOpen={modal1.isOpen}
					onClose={modal1.onClose}
					onOpenChange={modal1.onOpenChange}
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
										onPress={modal1.onClose}
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
				<Modal
					isOpen={modal2.isOpen}
					onClose={modal2.onClose}
					onOpenChange={modal2.onOpenChange}
					radius="lg"
					size="3xl"
					scrollBehavior="inside"
					classNames={{
						base: "bg-[#202020] border-[#41434A] border-2", // Added z-index to the modal
						backdrop: "",
					}}
				>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader className="flex flex-col gap-1">
									¿Cómo calcula NetRisk la pérdida potencial?
								</ModalHeader>
								<ModalBody>
									<Typography variant="h5" gutterBottom>
										Metodología FAIR
									</Typography>
									<Typography paragraph>
										FAIR (Factor Analysis of Information Risk) es un marco de
										referencia utilizado para cuantificar y analizar el riesgo
										relacionado con la seguridad de la información. Se centra en
										la evaluación de pérdidas potenciales derivadas de
										vulnerabilidades y permite a las organizaciones tomar
										decisiones informadas sobre cómo gestionar esos riesgos.
									</Typography>

									<Typography variant="h6" gutterBottom>
										Inputs de la Metodología FAIR
									</Typography>

									<Typography variant="body1" gutterBottom>
										1. <strong>Activos</strong>:
										<ul>
											<li>
												<strong>Valor del Activo:</strong> El valor monetario
												que representa el activo crítico (por ejemplo, datos
												sensibles, sistemas de información).
											</li>
										</ul>
									</Typography>

									<Typography variant="body1" gutterBottom>
										2. <strong>Amenazas</strong>:
										<ul>
											<li>
												<strong>Tipo de Amenaza:</strong> Identificación de las
												amenazas que pueden explotar una vulnerabilidad (por
												ejemplo, hackers, empleados deshonestos).
											</li>
											<li>
												<strong>Frecuencia de Amenazas:</strong> La frecuencia
												con la que se presentan amenazas similares, expresada en
												un período de tiempo.
											</li>
										</ul>
									</Typography>

									<Typography variant="body1" gutterBottom>
										3. <strong>Vulnerabilidades</strong>:
										<ul>
											<li>
												<strong>Descripción de la Vulnerabilidad:</strong>{" "}
												Características de la vulnerabilidad que permite que una
												amenaza acceda al activo.
											</li>
											<li>
												<strong>Probabilidad de Explotación:</strong> La
												probabilidad de que una vulnerabilidad sea efectivamente
												explotada por una amenaza.
											</li>
										</ul>
									</Typography>

									<Typography variant="body1" gutterBottom>
										4. <strong>Consecuencias</strong>:
										<ul>
											<li>
												<strong>Impacto Económico:</strong> La cantidad de
												dinero que se podría perder si la vulnerabilidad es
												explotada.
											</li>
											<li>
												<strong>Tiempo de Recuperación:</strong> Tiempo que se
												necesitaría para recuperarse de la explotación de la
												vulnerabilidad.
											</li>
										</ul>
									</Typography>

									<Typography variant="body1" gutterBottom>
										5. <strong>Controles</strong>:
										<ul>
											<li>
												<strong>Efectividad de los Controles:</strong>{" "}
												Evaluación de la efectividad de los controles de
												seguridad existentes.
											</li>
										</ul>
									</Typography>

									<Typography variant="h6" gutterBottom>
										Cálculo de Pérdida Potencial
									</Typography>

									<Typography paragraph>
										Con estos inputs, la metodología FAIR permite calcular la
										pérdida potencial mediante la siguiente fórmula:
									</Typography>

									<Typography variant="body1" gutterBottom>
										<code>
											Pérdida Potencial = Valor del Activo × Probabilidad de
											Explotación × Impacto
										</code>
									</Typography>
								</ModalBody>

								<ModalFooter></ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
				<Modal
					isOpen={modal3.isOpen}
					onClose={modal3.onClose}
					onOpenChange={modal3.onOpenChange}
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
									Rol: {selectedItem["role"]}
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
											<Typography
												variant="body2"
												sx={{ color: "#bdbdbd" }}
											></Typography>
											<Grid container spacing={2}>
												<Grid item xs={true} sm={true}>
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
																Persona asignada
															</Typography>
															<Typography
																variant="body2"
																sx={{ color: "#bdbdbd", margin: 0 }}
															>
																{selectedItem["assignedPerson"] || "N/a"}{" "}
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
													Acciones pendientes
												</Typography>
												<Textarea
													clearable
													bordered
													fullWidth
													placeholder="Agregar nota"
													value={selectedItem["pendingActions"]}
													onChange={(e) =>
														setSelectedItem({
															...selectedItem,
															pendingActions: e.target.value,
														})
													}
													rows={6}
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
										onPress={modal3.onClose}
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
