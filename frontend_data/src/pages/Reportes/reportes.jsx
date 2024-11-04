import React, { useState, useEffect } from "react";
import { DateRangePicker } from "@nextui-org/date-picker";
import { Button } from "@nextui-org/button";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import { Typography } from "@mui/material";
import "./reportes.css";
import ReporteCard from "./components/ReporteCard";
import { get, put } from "../../ApiRequests";
import { ToastContainer, toast } from "react-toastify"; // Importa ToastContainer y toast
import "react-toastify/dist/ReactToastify.css";

function Reportes() {
	const [selectedDateRange, setSelectedDateRange] = useState({
		startDate: null,
		endDate: null,
	});
	const [filteredReports, setFilteredReports] = useState([]);
	const [reportsData, setReportsData] = useState([]);

	useEffect(() => {
		get("api/reportes")
			.then((result) => {
				setReportsData(result.data);
				console.log(result.data);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
			});
	}, []);

	// Función para manejar el cambio en el DateRangePicker
	const handleDateRangeChange = (dateRange) => {
		setSelectedDateRange(dateRange);
	};

	const handleGenerateReportClick = () => {
		const  startDate = selectedDateRange.start;
		const  endDate = selectedDateRange.end;

		console.log(selectedDateRange);
		console.log(startDate);
		console.log(endDate);
		if (!startDate || !endDate) {
			toast.error("Por favor, selecciona un rango de fechas completo.");
			return;
		}
		put(
			"api/reportes/generar",
			{
				fechaInicio: startDate.toString(),
				fechaFin: endDate.toString()
			},
			() => {
				console.log("Reporte generado exitosamente!");
				toast.success("¡Reporte generado exitosamente!");
				// Fetch reports again if needed
			},
			() => {
				console.error("Error al generar reporte");
				toast.error("Error al generar el reporte");
			}
		);
	};

	return (
		<div className="reportes-container-full">
			<ToastContainer />
			<div className="flex flex-col p-6 gap-4 py-2 pb-4">
				<DateRangePicker
					labelPlacement="outside"
					variant="bordered"
					label="Seleccionar rango de fechas"
					className="max-w-xs"
					onChange={handleDateRangeChange}
					value={selectedDateRange}
				/>
				<Button
					color="default"
					size="small"
					endContent={<PostAddRoundedIcon fontSize="medium" />}
					className="px-14 w-1/4"
					onPress={handleGenerateReportClick}
				>
					Generar reporte
				</Button>
			</div>
			<div className="recomendacion-controles-container">
				<div className="reportes-titulo">
					<AssessmentRoundedIcon fontSize="large" />
					<Typography
						variant="h6"
						sx={{
							fontSize: "20px",
							fontWeight: "normal",
							width: "30vw",
						}}
					>
						Reportes generados
					</Typography>
				</div>
				<DateRangePicker
					labelPlacement="outside"
					variant="bordered"
					label="Filtrar por rango de fechas"
					className="max-w-xs"
				/>
			</div>
			<div className="flex flex-row px-6 gap-4 flex-wrap">
				{(filteredReports.length > 0 ? filteredReports : reportsData).map(
					// TODO: fix date range filter
					(report, index) => (
						<ReporteCard
							key={index}
							id={report.id}
							generatedDate={report.generatedDate}
							startDate={report.startDate}
							endDate={report.endDate}
							reportContent={report.reportContent}
						/>
					)
				)}
			</div>
		</div>
	);
}

export default Reportes;
