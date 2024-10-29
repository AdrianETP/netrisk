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
import { get } from "../../ApiRequests.js";
import { useEffect } from "react";


function Vulnerabilidades() {
const [initialDataTable1, setInitialDataTable1] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
	get("api/vul-tec")
		.then((result) => {
			setInitialDataTable1(result.data);
			setIsLoading(false);
			console.log(result.data);
		})
		.catch((error) => {
			console.error("Ocurrió un error:", error);
			setIsLoading(false);
		});
}, []);
	
const [initialDataTable2, setInitialDataTable2] = useState([]);

	useEffect(() => {
		get("api/vul-org")
			.then((result) => {
				setInitialDataTable2(result.data);
				setIsLoading(false);
				console.log(result.data);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
				setIsLoading(false);
			});
	}, []);

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


	const columnsTable2 = [
		{ key: "email", label: "CORREO" },
		{ key: "vulnerability", label: "VULNERABILIDAD" },
		{ key: "threat", label: "AMENAZA" },
		{ key: "potentialLoss", label: "PÉRDIDA POTENCIAL" },
		{ key: "impact", label: "IMPACTO" },
	];

	const editableColumns = [""];

	const dropdownOptions = {
		
	};

	return (
		<div className="">
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
