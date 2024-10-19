import React, { useState } from "react";
import SmallStatsCard from "./Components/SmallStatsCard";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";
import "./controles.css";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ControlCard from "./Components/ControlCard";

function Controles() {
	const stats = [
		{
			title: "Implementados",
			icon: (
				<CheckCircleOutlineRoundedIcon fontSize="14px" htmlColor="#17C964" />
			),
			value: "100",
		},
		{
			title: "En proceso",
			icon: <AccessTimeRoundedIcon fontSize="14px" htmlColor="#F5A524" />,
			value: "100",
		},
		{
			title: "En revisión",
			icon: <VisibilityOutlinedIcon fontSize="14px" htmlColor="#006FEE" />,
			value: "100",
		},
		{
			title: "Sin implementar",
			icon: <HighlightOffRoundedIcon fontSize="14px" htmlColor="#F31260" />,
			value: "100",
		},
		{
			title: "Excluidos",
			icon: (
				<RemoveCircleOutlineRoundedIcon fontSize="14px" htmlColor="#E4E4E7" />
			),
			value: "100",
		},
	];

	const controles = [
		{
			nombre: "Control de Acceso",
			code: "AC-1",
			description:
				"Establecer y administrar políticas de acceso para sistemas y datos.",
			state: "Implementado",
		},
		{
			nombre: "Conciencia y Entrenamiento",
			code: "AT-2",
			description: "Proporcionar entrenamiento de seguridad para el personal.",
			state: "En proceso",
		},
		{
			nombre: "Protección de Datos",
			code: "SC-28",
			description: "Proteger datos en almacenamiento y en tránsito.",
			state: "En revisión",
		},
		{
			nombre: "Monitoreo de Actividades",
			code: "AU-6",
			description:
				"Revisar registros de auditoría para detectar actividad anómala.",
			state: "Sin implementar",
		},
		{
			nombre: "Respaldo de Información",
			code: "CP-9",
			description: "Realizar copias de seguridad periódicas de la información.",
			state: "Excluido",
		},
	];

	const [inputValue, setInputValue] = useState("");
	const filteredControles = controles.filter((control) =>
		control.nombre.toLowerCase().includes(inputValue.toLowerCase())
	);

	return (
		<div className="controles-container-full pb-6">
			<div className="flex flex-row gap-4 p-4 ">
				{stats.map((stat, index) => (
					<SmallStatsCard
						key={index}
						text={stat.title}
						icon={stat.icon}
						stat={stat.value}
					/>
				))}
			</div>
			<div className="recomendacion-controles-container">
				<div className="recomendacion-controles-titulo">
					<AutoAwesomeRoundedIcon fontSize="large" />
					<Typography
						variant="h6"
						sx={{
							fontSize: "20px",
							fontWeight: "normal",
							width: "30vw",
						}}
					>
						Recomendaciones de seguridad
					</Typography>
				</div>
				<Autocomplete
					disablePortal
					options={controles}
					getOptionLabel={(option) => option.nombre}
					onInputChange={(event, newInputValue) => {
						setInputValue(newInputValue);
					}}
					sx={{
						width: 300,
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							placeholder="Búsqueda"
							InputProps={{
								...params.InputProps,
								startAdornment: (
									<InputAdornment position="start">
										<SearchRoundedIcon />
									</InputAdornment>
								),
								style: { borderRadius: 12 },
							}}
							sx={{
								height: "45px", // Adjust the height as needed
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
					)}
				/>
			</div>
			<div className="flex flex-row px-6 gap-6 flex-wrap	">
				{filteredControles.map((control, index) => (
					<ControlCard
						key={index}
						nombre={control.nombre}
						code={control.code}
						description={control.description}
						initialState={control.state}
					/>
				))}
			</div>
		</div>
	);
}

export default Controles;
