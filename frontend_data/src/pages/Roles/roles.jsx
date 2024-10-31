import SmallStatsCard from "../Controles/Components/SmallStatsCard.jsx";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import RecentActorsRoundedIcon from "@mui/icons-material/RecentActorsRounded";
import { Typography } from "@mui/material";
import { Progress } from "@nextui-org/react";
import "./roles.css";
import EditableTable from "../Components/EditableTable.jsx";
import { get } from "../../ApiRequests.js";
import { useEffect, useState } from "react";

function Roles() {
	const [rolesData, setRolesData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		get("api/roles")
			.then((result) => {
				// Ordena los datos según el impacto y el estado
				const sortedData = result.data.sort((a, b) => {
					// Primero, ordena por impacto crítico
					const impactOrder = { Crítico: 0, Alto: 1, Moderado: 2, Bajo: 3 };
					const impactComparison =
						impactOrder[a.impact] - impactOrder[b.impact];
					if (impactComparison !== 0) return impactComparison;

					// Si ambos tienen el mismo impacto, ordena por estado
					const statusOrder = {
						"Sin cumplir": 0,
						"En proceso": 1,
						Cumplido: 2,
					};
					return statusOrder[a.status] - statusOrder[b.status];
				});

				setRolesData(sortedData);
				setIsLoading(false);
				console.log(sortedData);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
				setIsLoading(false);
			});
	}, []);

	

	const columns = [
		{ key: "role", label: "ROL" },
		{ key: "assignedPerson", label: "PERSONA ASIGNADA" },
		{ key: "status", label: "ESTADO" },
		{ key: "pendingActions", label: "PENDIENTES" },
		{ key: "lastUpdate", label: "ACTUALIZACIÓN" },
		{ key: "impact", label: "IMPACTO" },
	];

	const editableColumns = ["pendingActions", "status"];
	const dropdownOptions = {
		status: ["Cumplido", "En proceso", "Sin cumplir"],
	};

	const completedCount = rolesData.filter(
		(item) => item.status === "Cumplido"
	).length;
	const inProgressCount = rolesData.filter(
		(item) => item.status === "En proceso"
	).length;
	const notTrainedCount = rolesData.filter(
		(item) => item.status === "Sin cumplir"
	).length;

	const stats = [
		{
			title: "Cumplidos",
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
			title: "Sin cumplir",
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
					aria-label="Cumplimiento de roles"
					label="Cumplimiento de roles"
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
					<RecentActorsRoundedIcon fontSize="large" />
					<Typography
						variant="h6"
						sx={{
							fontSize: "20px",
							fontWeight: "normal",
							width: "30vw",
						}}
					>
						Gestión de roles
					</Typography>
				</div>
				<div className="tabla-roles">
					<EditableTable
						columns={columns}
						initialData={rolesData}
						editableColumns={editableColumns}
						dropdownOptions={dropdownOptions}
						baseHeight="max-h-[340px]"
					/>
				</div>
			</div>
		</div>
	);
}
export default Roles;
