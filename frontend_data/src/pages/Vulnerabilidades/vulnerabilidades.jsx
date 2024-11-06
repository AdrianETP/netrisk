import { useState, useEffect } from "react";
import ProgressCircle from "../Components/ProgressCircle.jsx";
import EditableTable from "../Components/EditableTable.jsx";
import { Button, ButtonGroup } from "@nextui-org/button";
import "./vulnerabilidades.css";
import StatsCard from "./Components/StatsCard.jsx";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { get } from "../../ApiRequests.js";

function Vulnerabilidades() {
	const [initialDataTable1, setInitialDataTable1] = useState([]);
	const [initialDataTable2, setInitialDataTable2] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [table1Loaded, setTable1Loaded] = useState(false);
	const [table2Loaded, setTable2Loaded] = useState(false);
	const [displayValue, setDisplayValue] = useState("0");
	const [totalVulnerabilities, setTotalVulnerabilities] = useState(0);
	const [stats, setStats] = useState([]);

	// Función para ordenar vulnerabilidades
	const sortVulnerabilities = (vulnerabilities) => {
		return vulnerabilities.sort((a, b) => {
			const impactOrder = {
				Crítico: 1,
				Alto: 2,
				Moderado: 3,
				Bajo: 4,
			};
			// Primero ordena por impacto, luego por pérdida potencial en orden descendente
			if (impactOrder[a.impact] !== impactOrder[b.impact]) {
				return impactOrder[a.impact] - impactOrder[b.impact];
			} else {
				return b.potentialLoss - a.potentialLoss;
			}
		});
	};

	useEffect(() => {
		get("api/vul-tec")
			.then((result) => {
				setInitialDataTable1(sortVulnerabilities(result.data));
				setTable1Loaded(true);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		get("api/vul-org")
			.then((result) => {
				setInitialDataTable2(sortVulnerabilities(result.data));
				setTable2Loaded(true);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		if (table1Loaded && table2Loaded) {
			setIsLoading(false);
			const totalVulnerabilities =
				initialDataTable1.length + initialDataTable2.length;
			const mitigationPercentage =
				(initialDataTable2.length / totalVulnerabilities) * 100;
			setDisplayValue(mitigationPercentage.toFixed(2));
			setTotalVulnerabilities(totalVulnerabilities);

			const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };

			[...initialDataTable1, ...initialDataTable2].forEach((vul) => {
				if (vul.impact === "Crítico") severityCounts.critical += 1;
				else if (vul.impact === "Alto") severityCounts.high += 1;
				else if (vul.impact === "Moderado") severityCounts.medium += 1;
				else if (vul.impact === "Bajo") severityCounts.low += 1;
			});

			setStats([
				{
					icon: <ErrorOutlinedIcon style={{ fontSize: 24 }} />,
					value: severityCounts.critical,
					color: "#F31260",
				},
				{
					icon: <WarningRoundedIcon style={{ fontSize: 24 }} />,
					value: severityCounts.high,
					color: "#F5A524",
				},
				{
					icon: <RemoveCircleOutlineRoundedIcon style={{ fontSize: 24 }} />,
					value: severityCounts.medium,
					color: "#7828C8",
				},
				{
					icon: <CheckCircleOutlineRoundedIcon style={{ fontSize: 24 }} />,
					value: severityCounts.low,
					color: "#17C964",
				},
			]);
		}
	}, [table1Loaded, table2Loaded, initialDataTable1, initialDataTable2]);

	const [selectedTable, setSelectedTable] = useState("table1");

	const columnsTable1 = [
		{ key: "id", label: "ID DEL ACTIVO" },
		{ key: "vulnerability", label: "VULNERABILIDAD" },
		{ key: "threat", label: "AMENAZA" },
		{ key: "potentialLoss", label: "PÉRDIDA POTENCIAL" },
		{ key: "impact", label: "IMPACTO" },
	];

	const columnsTable2 = [
		{ key: "email", label: "CORREO" },
		{ key: "vulnerability", label: "VULNERABILIDAD" },
		{ key: "threat", label: "AMENAZA" },
		{ key: "potentialLoss", label: "PÉRDIDA POTENCIAL" },
		{ key: "impact", label: "IMPACTO" },
	];

	const editableColumns = [""];

	const dropdownOptions = {};

	return (
		<div className="">
			<div className="vuln-top">
				<div className="flex flex-row px-4 circulos-vuln">
					<div className="flex flex-row p-4 gap-4 mb-2">
						<ProgressCircle
							progressValue={100}
							displayValue={totalVulnerabilities.toString()}
							customColor="#0DD4CE"
							size={170}
							strokeWidth={9}
							label="Vulnerabilidades detectadas"
						/>
						<ProgressCircle
							progressValue={displayValue}
							displayValue={`${displayValue}%`}
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
								? "bg-[#A1A1AA] text-[#202020] font-semibold"
								: "bg-transparent text-[#A1A1AA] border-[#A1A1AA] border-2"
						}`}
					>
						Vulnerabilidades técnicas
					</Button>
					<Button
						onClick={() => setSelectedTable("table2")}
						className={`px-4 py-2 text-sm ${
							selectedTable === "table2"
								? "bg-[#A1A1AA] text-[#202020] font-semibold"
								: "bg-transparent text-[#A1A1AA] border-[#A1A1AA] border-2"
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
