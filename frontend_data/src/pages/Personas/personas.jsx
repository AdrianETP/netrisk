import SmallStatsCard from "../Controles/Components/SmallStatsCard.jsx";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { Typography } from "@mui/material";
import { Progress } from "@nextui-org/react";
import "../Roles/roles.css";
import EditableTable from "../Components/EditableTable.jsx";
import { get } from "../../ApiRequests.js";
import { useEffect, useState } from "react";

function Personas() {
	const [trainingData, setTrainingData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		get("api/personas")
			.then((result) => {
				setTrainingData(result.data);
				setIsLoading(false);
				console.log(result.data);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
				setIsLoading(false);
			});
	}, []);

	

	const columns = [
		{ key: "nombre", label: "NOMBRE" },
		{ key: "correo", label: "CORREO" },
		{ key: "departamento", label: "DEPARTAMENTO" },
		{ key: "status", label: "ESTADO DE CAPACITACIÓN" },
		{ key: "fechaCapacitacion", label: "FECHA DE CAPACITACIÓN" },
	];

	const editableColumns = ["status"];
	const dropdownOptions = {
		status: ["Completada", "En proceso", "Faltante"],
	};

	const completedCount = trainingData.filter(
		(item) => item.status === "Completada"
	).length;
	const inProgressCount = trainingData.filter(
		(item) => item.status === "En proceso"
	).length;
	const notTrainedCount = trainingData.filter(
		(item) => item.status === "Faltante"
	).length;

	const stats = [
		{
			title: "Capacitadas",
			icon: (
				<CheckCircleOutlineRoundedIcon fontSize="14px" htmlColor="#17C964" />
			),
			value: completedCount,
		},
		{
			title: "En proceso",
			icon: <AccessTimeRoundedIcon fontSize="14px" htmlColor="#F5A524" />,
			value: inProgressCount,
		},
		{
			title: "Sin capacitar",
			icon: <HighlightOffRoundedIcon fontSize="14px" htmlColor="#F31260" />,
			value: notTrainedCount,
		},
	];

	// Calculate progress value
	const cumplidosValue = stats[0].value;
	const enProcesoValue = stats[1].value;
	const sinCumplirValue = stats[2].value;

	const totalValue = cumplidosValue + enProcesoValue + sinCumplirValue;
	const progressValue =
		totalValue > 0 ? (cumplidosValue / totalValue) * 100 : 0;

	const getProgressColor = (value) => {
		if (value >= 75) {
			return "success"; // Green for 75% and above
		} else if (value >= 50) {
			return "warning"; // Yellow for 50% to 74%
		} else {
			return "danger"; // Red for below 50%
		}
	};

	return (
		<div className="">
			<div className="flex flex-row gap-4 p-4 ">
				{stats.map((stat, index) => (
					<SmallStatsCard
						key={index}
						text={stat.title}
						icon={stat.icon}
						stat={stat.value}
					/>
				))}
				<Progress
					aria-label="Cumplimiento de capacitación"
					label="Cumplimiento de capacitación"
					size="lg"
					value={progressValue}
					color={getProgressColor(progressValue)} // Set color based on progress value
					showValueLabel={true}
					className="w-1/3 mx-auto self-center"
					radius="sm"
				/>
			</div>
			<div className="gestion-roles-container">
				<div className="gestion-roles-titulo">
					<BadgeRoundedIcon fontSize="large" />
					<Typography
						variant="h6"
						sx={{
							fontSize: "20px",
							fontWeight: "normal",
							width: "30vw",
						}}
					>
						Gestión de capacitaciones
					</Typography>
				</div>
				<div className="tabla-roles">
					<EditableTable
						columns={columns}
						initialData={trainingData}
						editableColumns={editableColumns}
						dropdownOptions={dropdownOptions}
						baseHeight="max-h-[340px]"
					/>
				</div>
			</div>
		</div>
	);
}
export default Personas;
