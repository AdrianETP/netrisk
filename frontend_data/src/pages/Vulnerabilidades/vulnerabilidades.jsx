import { useState } from "react";
import ProgressCircle from "../Components/ProgressCircle.jsx";
import EditableTable from "../Components/EditableTable.jsx";
import { Button, ButtonGroup } from "@nextui-org/button";
import "./vulnerabilidades.css";
import StatsCard from "./Components/StatsCard.jsx";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

function Vulnerabilidades() {
	const [selectedTable, setSelectedTable] = useState("table1");

	const stats = [
		{
			icon: <ErrorOutlinedIcon style={{ fontSize: 24 }} />,
			value: 12,
			color: "#F31260",
		},
		{
			icon: <WarningRoundedIcon style={{ fontSize: 24 }} />,
			value: 25,
			color: "#F5A524",
		},
		{
			icon: <RemoveCircleOutlineRoundedIcon style={{ fontSize: 24 }} />,
			value: 7,
			color: "#7828C8",
		},
		{
			icon: <CheckCircleOutlineRoundedIcon style={{ fontSize: 24 }} />,
			value: 7,
			color: "#17C964",
		},
	];
	const columnsTable1 = [
		{ key: "id", label: "ID DEL ACTIVO" },
		{ key: "vulnerability", label: "VULNERABILIDAD" },
		{ key: "threat", label: "AMENAZA" },
		{ key: "potentialLoss", label: "PÉRDIDA POTENCIAL" },
		{ key: "impact", label: "IMPACTO" },
	];

	const initialDataTable1 = [
		{
			id: "router1",
			vulnerability: "Puerto 23 (Telnet) Abierto",
			threat: "Acceso no autorizado",
			impact: "Crítico",
			potentialLoss: "$10,000 - $50,000",
		},
		{
			id: "pc2",
			vulnerability: "CVE-2020-3452 Cisco ASA",
			threat: "Ejecución remota de código",
			impact: "Alto",
			potentialLoss: "$20,000 - $75,000",
		},
		{
			id: "server3",
			vulnerability: "CVE-2019-0708 BlueKeep",
			threat: "Acceso remoto no autorizado",
			impact: "Bajo",
			potentialLoss: "$5,000 - $20,000",
		},
		{
			id: "smartphone4",
			vulnerability: "CVE-2021-1879 WebKit",
			threat: "Ejecución de código malicioso",
			impact: "Moderado",
			potentialLoss: "$15,000 - $30,000",
		},
	];

	const columnsTable2 = [
		{ key: "email", label: "CORREO" },
		{ key: "vulnerability", label: "VULNERABILIDAD" },
		{ key: "threat", label: "AMENAZA" },
		{ key: "potentialLoss", label: "PÉRDIDA POTENCIAL" },
		{ key: "impact", label: "IMPACTO" },
	];

	const initialDataTable2 = [
		{
			id: 3,
			email: "johndoe@example.com",
			vulnerability: "Última capacitación hace 7 meses",
			threat: "Acceso no autorizado",
			potentialLoss: "$1,000 - $5,000",
			impact: "Crítico",
		},
		{
			id: 4,
			email: "janedoe@example.com",
			vulnerability:
				"Incumplimiento del rol 'Control de Acceso' del NIST",
			threat: "Phishing",
			potentialLoss: "$500 - $3,000",
			impact: "Alto",
		},
		{
			id: 5,
			email: "alicesmith@example.com",
			vulnerability: "Última capacitación hace 7 meses",
			threat: "Malware",
			potentialLoss: "$2,000 - $7,000",
			impact: "Moderado",
		},
		{
			id: 6,
			email: "N/A",

			vulnerability:
				"No se ha cumplido con el rol de 'Senior Agency Official' del NIST",
			threat: "Robo de identidad",
			potentialLoss: "$1,500 - $4,500",
			impact: "Moderado",
		},
		{
			id: 7,
			email: "emilydavis@example.com",
			vulnerability:
				"No se ha cumplido con el rol de 'Respuestas a Incidentes' del NIST",
			threat: "Denegación de servicio",
			potentialLoss: "$300 - $2,000",
			impact: "Bajo",
		},
		{
			id: 8,
			email: "N/A",
			vulnerability:
				"No se ha cumplido con el rol de 'Auditoría y Responsabilidad' del NIST",
			threat: "Phishing",
			potentialLoss: "$1,000 - $6,000",
			impact: "Bajo",
		},
	];




	const editableColumns = [""];

	const dropdownOptions = {
		
	};

	return (
		<div>
			<div className="vuln-top">
				<div className="flex flex-row px-4 circulos-vuln">
					<div className="flex flex-row p-4 gap-4 mb-2">
						<ProgressCircle
							progressValue={100} // Controls the progress bar percentage
							displayValue="100" // The value shown inside the circle
							customColor="#0DD4CE"
							size={170}
							strokeWidth={9}
							label="Vulnerabilidades detectadas"
						/>
						<ProgressCircle
							progressValue={75} // Controls the progress bar percentage
							displayValue="75%" // The value shown inside the circle
							customColor="#0DD4CE"
							size={170}
							strokeWidth={9}
							label="Mitigación"
						/>
					</div>
					<div className="flex justify-center w-full">
						<StatsCard stats={stats} />
					</div>
				</div>
			</div>
			<div className="btn-group-vul">
				<ButtonGroup>
					<Button
						onClick={() => setSelectedTable("table1")}
						className={`px-4 py-2 text-sm ${
							selectedTable === "table1"
								? "bg-[#A1A1AA] text-[#202020] font-semibold" // Selected: Light grey background, dark text
								: "bg-transparent text-[#A1A1AA] border-[#A1A1AA] border-2" // Unselected: Transparent background, grey border and text
						}`}
					>
						Vulnerabilidades técnicas
					</Button>
					<Button
						onClick={() => setSelectedTable("table2")}
						className={`px-4 py-2 text-sm ${
							selectedTable === "table2"
								? "bg-[#A1A1AA] text-[#202020] font-semibold" // Selected: Light grey background, dark text
								: "bg-transparent text-[#A1A1AA] border-[#A1A1AA] border-2" // Unselected: Transparent background, grey border and text
						}`}
					>
						Vulnerabilidades organizacionales
					</Button>
				</ButtonGroup>
			</div>
			<div className="tabla-vulnerabilidades">
				{selectedTable === "table1" && (
					<EditableTable
						columns={columnsTable1}
						initialData={initialDataTable1}
						editableColumns={editableColumns}
						dropdownOptions={dropdownOptions}
					/>
				)}
				{selectedTable === "table2" && (
					<EditableTable
						columns={columnsTable2}
						initialData={initialDataTable2}
						editableColumns={editableColumns}
						dropdownOptions={dropdownOptions}
					/>
				)}
			</div>
		</div>
	);
}

export default Vulnerabilidades;
