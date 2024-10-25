import React, { useState } from "react";
import { DateRangePicker } from "@nextui-org/date-picker";
import { Button } from "@nextui-org/button";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import { Typography } from "@mui/material";
import "./reportes.css";
import ReporteCard from "./components/ReporteCard";

function Reportes() {
	const [selectedDateRange, setSelectedDateRange] = useState({
		startDate: null,
		endDate: null,
	});
	const [filteredReports, setFilteredReports] = useState([]);

	const reportsData = [
		{
			id: 1,
			generatedDate: "2024-10-20",
			startDate: "2024-10-01",
			endDate: "2024-10-18",
			reportContent:
				"Audit Summary: All systems within the TI department were found compliant. Minor vulnerabilities related to outdated software were patched. No critical incidents detected. Recommendation: Schedule regular updates and conduct a bi-annual security review.",
		},
		{
			id: 2,
			generatedDate: "2024-10-21",
			startDate: "2024-09-25",
			endDate: "2024-10-17",
			reportContent:
				"Audit Summary: The Recursos Humanos department passed the compliance checks. Data handling procedures were secure, but internal password policies need strengthening. Recommendation: Implement a stricter password policy and conduct employee training.",
		},
		{
			id: 3,
			generatedDate: "2024-10-19",
			startDate: "2024-10-05",
			endDate: "2024-10-19",
			reportContent:
				"Audit Summary: Ongoing security evaluation for the TI department. Preliminary findings show weak spots in network segmentation. Full results pending. Recommendation: Implement VLANs for sensitive areas and perform a follow-up audit.",
		},
		{
			id: 4,
			generatedDate: "2024-10-15",
			startDate: "2024-09-28",
			endDate: "2024-10-15",
			reportContent:
				"Audit Summary: Recursos Humanos department failed to meet minimum security standards. Outdated firewall configurations and missing patches were identified. Recommendation: Immediate patching required and review of firewall rules.",
		},
		{
			id: 5,
			generatedDate: "2024-10-16",
			startDate: "2024-10-02",
			endDate: "2024-10-16",
			reportContent:
				"Audit Summary: Security assessment in the Seguridad department revealed unmonitored devices connected to the network. Additionally, access logs were incomplete. Recommendation: Disconnect unauthorized devices and enforce logging policies.",
		},
		{
			id: 6,
			generatedDate: "2024-10-20",
			startDate: "2024-10-01",
			endDate: "2024-10-18",
			reportContent:
				"Audit Summary: Re-assessment in the TI department showed compliance improvement. Vulnerabilities from the previous audit were successfully addressed. Recommendation: Continue with scheduled patching and periodic audits.",
		},
		{
			id: 7,
			generatedDate: "2024-10-21",
			startDate: "2024-09-25",
			endDate: "2024-10-17",
			reportContent:
				"Audit Summary: Recursos Humanos department's second audit confirmed improved password security, but phishing susceptibility remains. Recommendation: Conduct phishing awareness training and implement two-factor authentication.",
		},
		{
			id: 8,
			generatedDate: "2024-10-19",
			startDate: "2024-10-05",
			endDate: "2024-10-19",
			reportContent:
				"Audit Summary: In-progress audit in the TI department. Several network vulnerabilities identified, mainly around access controls. Recommendation: Tighten access control measures and complete the audit for a final report.",
		},
		{
			id: 9,
			generatedDate: "2024-10-15",
			startDate: "2024-09-28",
			endDate: "2024-10-15",
			reportContent:
				"Audit Summary: Recursos Humanos department audit pending completion. Initial findings show outdated antivirus software on several machines. Recommendation: Update antivirus software and conduct a full system scan.",
		},
		{
			id: 10,
			generatedDate: "2024-10-16",
			startDate: "2024-10-02",
			endDate: "2024-10-16",
			reportContent:
				"Audit Summary: Seguridad department's audit detected potential data leakage risks due to improper handling of sensitive files. Recommendation: Implement strict data classification policies and secure file storage.",
		},
	];

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
