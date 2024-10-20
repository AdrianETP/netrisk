import SmallStatsCard from "../Controles/Components/SmallStatsCard.jsx";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import RecentActorsRoundedIcon from "@mui/icons-material/RecentActorsRounded";
import { Typography } from "@mui/material";
import { Progress } from "@nextui-org/react";
import "./roles.css";
import EditableTable from "../Components/EditableTable.jsx";

function Roles() {

	const rolesData = [
		{
			id: 1,
			role: "Senior Agency Information Security Officer (SAISO)",
			description:
				"Encargado de supervisar la implementación de programas de seguridad de la información en la agencia, asegurando que se sigan políticas y directrices establecidas.",
			assignedPerson: "Juan Pérez",
			status: "Cumplido",
			pendingActions:
				"Revisión de políticas de seguridad, Actualización de procedimientos de respuesta a incidentes",
			impact: "Crítico",
			lastUpdate: "2024-10-18",
		},
		{
			id: 2,
			role: "Authorizing Official (AO)",
			description:
				"Responsable de aceptar o rechazar los riesgos relacionados con el uso de un sistema de información, basado en un análisis de seguridad.",
			assignedPerson: "María López",
			status: "Cumplido",
			pendingActions:
				"Evaluar el informe de análisis de riesgos, Aprobar plan de mitigación",
			impact: "Alto",
			lastUpdate: "2024-10-17",
		},
		{
			id: 3,
			role: "Information System Security Officer (ISSO)",
			description:
				"Responsable de garantizar la seguridad operativa diaria de los sistemas de información, manteniendo las medidas de seguridad y coordinando la respuesta a incidentes.",
			assignedPerson: "Carlos Gómez",
			status: "En proceso",
			pendingActions:
				"Implementar controles de acceso adicionales, Realizar pruebas de penetración",
			impact: "Moderado",
			lastUpdate: "2024-10-19",
		},
		{
			id: 4,
			role: "Information Owner/Steward",
			description:
				"Persona o grupo con la responsabilidad de establecer los requisitos de seguridad para la protección de la información almacenada en un sistema de información.",
			assignedPerson: "Laura Martínez",
			status: "Sin cumplir",
			pendingActions: "Ninguna",
			impact: "Bajo",
			lastUpdate: "2024-10-15",
		},
		{
			id: 5,
			role: "Risk Executive (Function)",
			description:
				"Encargado de coordinar la gestión de riesgos a nivel organizacional, asegurando que los riesgos sean consistentes en todos los sistemas.",
			assignedPerson: "Pedro Ramírez",
			status: "Sin cumplir",
			pendingActions:
				"Revisar riesgos identificados en nuevos proyectos, Actualizar la política de gestión de riesgos",
			impact: "Bajo",
			lastUpdate: "2024-10-16",
		},
		{
			id: 6,
			role: "Senior Agency Information Security Officer (SAISO)",
			description:
				"Encargado de supervisar la implementación de programas de seguridad de la información en la agencia, asegurando que se sigan políticas y directrices establecidas.",
			assignedPerson: "Juan Pérez",
			status: "Cumplido",
			pendingActions:
				"Revisión de políticas de seguridad, Actualización de procedimientos de respuesta a incidentes",
			impact: "Crítico",
			lastUpdate: "2024-10-18",
		},
		{
			id: 7,
			role: "Authorizing Official (AO)",
			description:
				"Responsable de aceptar o rechazar los riesgos relacionados con el uso de un sistema de información, basado en un análisis de seguridad.",
			assignedPerson: "María López",
			status: "Cumplido",
			pendingActions:
				"Evaluar el informe de análisis de riesgos, Aprobar plan de mitigación",
			impact: "Alto",
			lastUpdate: "2024-10-17",
		},
		{
			id: 8,
			role: "Information System Security Officer (ISSO)",
			description:
				"Responsable de garantizar la seguridad operativa diaria de los sistemas de información, manteniendo las medidas de seguridad y coordinando la respuesta a incidentes.",
			assignedPerson: "Carlos Gómez",
			status: "En proceso",
			pendingActions:
				"Implementar controles de acceso adicionales, Realizar pruebas de penetración",
			impact: "Moderado",
			lastUpdate: "2024-10-19",
		},
		{
			id: 9,
			role: "Information Owner/Steward",
			description:
				"Persona o grupo con la responsabilidad de establecer los requisitos de seguridad para la protección de la información almacenada en un sistema de información.",
			assignedPerson: "Laura Martínez",
			status: "Sin cumplir",
			pendingActions: "Ninguna",
			impact: "Bajo",
			lastUpdate: "2024-10-15",
		},
		{
			id: 10,
			role: "Risk Executive (Function)",
			description:
				"Encargado de coordinar la gestión de riesgos a nivel organizacional, asegurando que los riesgos sean consistentes en todos los sistemas.",
			assignedPerson: "Pedro Ramírez",
			status: "Sin cumplir",
			pendingActions:
				"Revisar riesgos identificados en nuevos proyectos, Actualizar la política de gestión de riesgos",
			impact: "Bajo",
			lastUpdate: "2024-10-16",
		},
	];


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



	const stats = [
		{
			title: "Cumplidos",
			icon: (
				<CheckCircleOutlineRoundedIcon fontSize="14px" htmlColor="#17C964" />
			),
			value: 100,
		},
		{
			title: "En proceso",
			icon: <AccessTimeRoundedIcon fontSize="14px" htmlColor="#F5A524" />,
			value: 100,
		},
		{
			title: "Sin cumplir",
			icon: <HighlightOffRoundedIcon fontSize="14px" htmlColor="#F31260" />,
			value: 100,
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
