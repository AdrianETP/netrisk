import {
	IconButton,
	Tooltip,
	Typography,
	CircularProgress,
} from "@mui/material";
import ProgressCircle from "../Components/ProgressCircle.jsx";
import "./dashboard.css";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDisclosure } from "@nextui-org/react";
import NetScoreModal from "./components/NetScoreModal.jsx";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React, { useEffect, useState } from "react";
import { get } from "../../ApiRequests.js";

function Dashboard() {
	const modal1 = useDisclosure();
	const [data, setData] = useState(null);

	// Define a custom color palette
	const customPalette = ["#0DD4CE", "#F46197", "#ECFFB0", "#54577C", "#4A7B9D"];

	useEffect(() => {
		get("api/dashboard/get")
			.then((result) => {
				setData(result);
				console.log(result.netscore);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
			});
	}, []);

	// Check if data is loading
	if (!data) {
		return (
			<div
				className="flex justify-center items-center"
				style={{ height: "50vh" }}
			>
				<CircularProgress size={60} />
			</div>
		);
	}

	// Convert fecha to Date objects in netscore
	const formattedNetScoreData = data.netscore.map((entry) => ({
		...entry,
		fecha: new Date(entry.fecha), // Convert fecha to a Date object
	}));



	// Function to format date to "Mes Año"
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const options = { year: "numeric", month: "short", locale: "es-ES" };
		const formattedDate = date.toLocaleDateString("es-ES", options);
		return formattedDate.replace(".", ""); // Remove the dot from the abbreviated month
	};

	return (
		<div className="flex flex-row flex-wrap p-6 pt-0 items-center gap-y-4 gap-x-6">
			<div className="card-background-dashboard">
				<Typography>Historial de NetScore</Typography>
				<LineChart
					dataset={formattedNetScoreData}
					xAxis={[{ dataKey: "fecha", valueFormatter: formatDate }]} // Set the x-axis to use the "fecha" key
					series={[
						{
							dataKey: "netscore", // Reference the "netscore" key for y values
							name: "Net Score", // Optional: Name of the series
						},
					]}
					width={350}
					height={191}
					margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
				/>
			</div>
			<div className="relative justify-center -mr-5">
				<ProgressCircle
					progressValue={data.netscore[0].netscore} // Use the latest netscore
					displayValue={data.netscore[0].netscore.toFixed(2)} // Show the value inside the circle
					customColor="#0DD4CE"
					size={170}
					strokeWidth={9}
					label="NetScore"
				/>
				<Tooltip title="¿Qué es el NetScore?" arrow>
					<IconButton
						onClick={modal1.onOpen}
						sx={{
							position: "absolute",
							top: "0px",
							right: "0px",
							color: "#ffffff",
						}}
					>
						<HelpOutlineIcon />
					</IconButton>
				</Tooltip>
			</div>

			<div className="card-background-dashboard">
				<Typography>Vulnerabilidades por categoría</Typography>
				<PieChart
					series={[
						{
							data: Object.entries(
								data.vulnerabilidades_por_impacto[0].data.tecnicas
							).map(([key, value]) => ({
								label: key,
								value,
								color:
									customPalette[
										Object.keys(
											data.vulnerabilidades_por_impacto[0].data.tecnicas
										).indexOf(key) % customPalette.length
									],
							})),
							highlightScope: { fade: "global", highlight: "item" },
							faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
						},
					]}
					height={191}
					width={380}
					margin={{ left: 0, right: 150, top: 15, bottom: 15 }}
				/>
			</div>
			<div className="card-background-dashboard">
				<Typography>Vulnerabilidades por activos</Typography>
				<BarChart
					xAxis={[
						{
							scaleType: "band",
							data: Object.keys(data.vulnerabilidades_por_activo[0].data),
						},
					]} // Use the asset names from the API response
					series={[
						{
							data: Object.values(data.vulnerabilidades_por_activo[0].data).map(
								(vulnerabilities) => {
									return Object.values(vulnerabilities)[0]; // Get the count of vulnerabilities
								}
							),
						},
					]}
					width={460}
					height={191}
					margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
				/>
			</div>
			<div className="card-background-dashboard">
				<Typography>Porcentaje de remediación de vulnerabilidades</Typography> 
				<LineChart
					xAxis={[
						{
							data: data.porcentaje_remediacion[0].data.map(
								(item) => item.auditoria_actual
							),
						},
					]} // Use the current audit numbers
					series={[
						{
							data: data.porcentaje_remediacion[0].data.map(
								(item) => item.porcentaje_remediacion
							), // Use remediation percentages
							color: "#F46197",
						},
					]}
					width={460}
					height={191}
					margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
				/>
			</div>
			<NetScoreModal isVisible={modal1.isOpen} onClose={modal1.onClose} />
		</div>
	);
}

export default Dashboard;
