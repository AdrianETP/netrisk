import React, { useState, useEffect } from "react";
import { DateRangePicker } from "@nextui-org/date-picker";
import { Button } from "@nextui-org/button";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import { Typography } from "@mui/material";
import "./reportes.css";
import ReporteCard from "./components/ReporteCard";
import { get } from "../../ApiRequests";

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
		const { startDate, endDate } = dateRange;

		if (startDate && endDate) {
			// Filtrar los reportes que estén dentro del rango de fechas seleccionado
			const filtered = reportsData.filter((report) => {
				const reportDate = new Date(report.generatedDate);
				return (
					reportDate >= new Date(startDate) && reportDate <= new Date(endDate)
				);
			});
			setFilteredReports(filtered);
		} else {
			// Si no hay rango seleccionado, mostrar todos los reportes
			setFilteredReports(reportsData);
		}
	};

	return (
		<div className="reportes-container-full">
			<div className="flex flex-col p-6 gap-4 py-2 pb-4">
				<DateRangePicker
					labelPlacement="outside"
					variant="bordered"
					label="Seleccionar rango de fechas"
					className="max-w-xs"
					onChange={handleDateRangeChange}
				/>
				<Button
					color="default"
					size="small"
					endContent={<PostAddRoundedIcon fontSize="medium" />}
					className="px-14 w-1/4"
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
					onChange={handleDateRangeChange}
				/>
			</div>
			<div className="flex flex-row px-6 gap-4 flex-wrap">
				{(filteredReports.length > 0 ? filteredReports : reportsData).map( // TODO: fix date range filter
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
