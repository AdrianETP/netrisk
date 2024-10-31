import { useEffect, useState } from "react";
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
import { get } from "../../ApiRequests.js";

function Controles() {
	const [controls, setControls] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState({
		implemented: 0,
		inProcess: 0,
		inReview: 0,
		notImplemented: 0,
		excluded: 0,
	});
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		// Fetch data from the API
		get("api/controles")
			.then((result) => {
				setControls(result.data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
				setIsLoading(false);
			});
	}, []);

	const calculateStats = () => {
		const newStats = {
			implemented: controls.filter(
				(control) => control.state === "Implementado"
			).length,
			inProcess: controls.filter((control) => control.state === "En proceso")
				.length,
			inReview: controls.filter((control) => control.state === "En revisión")
				.length,
			notImplemented: controls.filter(
				(control) => control.state === "Sin implementar"
			).length,
			excluded: controls.filter((control) => control.state === "Excluido")
				.length,
		};
		setStats(newStats);
	};

	useEffect(() => {
		// Calculate stats dynamically whenever 'controls' changes
		calculateStats();
	}, [controls]);

	const filteredControles = controls.filter((control) =>
		control.nombre.toLowerCase().includes(inputValue.toLowerCase())
	);

	return (
		<div className="controles-container-full pb-6">
			<div className="flex flex-row gap-4 p-4 ">
				<SmallStatsCard
					text="Implementados"
					icon={
						<CheckCircleOutlineRoundedIcon
							fontSize="14px"
							htmlColor="#17C964"
						/>
					}
					stat={stats.implemented}
				/>
				<SmallStatsCard
					text="En proceso"
					icon={<AccessTimeRoundedIcon fontSize="14px" htmlColor="#F5A524" />}
					stat={stats.inProcess}
				/>
				<SmallStatsCard
					text="En revisión"
					icon={<VisibilityOutlinedIcon fontSize="14px" htmlColor="#006FEE" />}
					stat={stats.inReview}
				/>
				<SmallStatsCard
					text="Sin implementar"
					icon={<HighlightOffRoundedIcon fontSize="14px" htmlColor="#F31260" />}
					stat={stats.notImplemented}
				/>
				<SmallStatsCard
					text="Excluidos"
					icon={
						<RemoveCircleOutlineRoundedIcon
							fontSize="14px"
							htmlColor="#E4E4E7"
						/>
					}
					stat={stats.excluded}
				/>
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
					options={controls}
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
			<div className="flex flex-row px-6 gap-6 flex-wrap">
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
