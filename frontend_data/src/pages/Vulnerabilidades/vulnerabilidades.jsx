import React from "react";
import ProgressCircle from "../Components/ProgressCircle.jsx";
import EditableTable from "../Components/EditableTable.jsx";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { Button } from "@nextui-org/button";
import "./vulnerabilidades.css";
import placeholder from "./placeholder-matriz.png";
import StatsCard from "./Components/StatsCard.jsx";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

function Vulnerabilidades() {
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
	const columns = [
		{ key: "ip", label: "IP" },
		{ key: "macAddress", label: "MAC ADDRESS" },
		{ key: "device", label: "DISPOSITIVO" },
		{ key: "vulnerability", label: "VULNERABILIDAD" },
		{ key: "impact", label: "IMPACTO" },
	];

	const initialData = [
		{
			id: 1,
			ip: "192.168.0.1",
			macAddress: "00:0a:95:9d:68:16",
			device: "Router",
			vulnerability: "CVE-2020-3452 Cisco ASA Path Traversal",
			impact: "Crítico",
		},
		{
			id: 2,
			ip: "192.168.0.2",
			macAddress: "00:0a:95:9d:68:17",
			device: "PC",
			vulnerability: "MS17-010 EternalBlue SMB Remote Code Execution",
			impact: "Alto",
		},
		{
			id: 3,
			ip: "192.168.0.3",
			macAddress: "00:0a:95:9d:68:18",
			device: "Servidor",
			vulnerability: "CVE-2019-0708 BlueKeep RDP Remote Code Execution",
			impact: "Bajo",
		},
		{
			id: 4,
			ip: "192.168.0.4",
			macAddress: "00:0a:95:9d:68:19",
			device: "Smartphone",
			vulnerability: "CVE-2021-1879 WebKit Use-After-Free Vulnerability",
			impact: "Moderado",
		},
	];


	const editableColumns = [""];

	const dropdownOptions = {
		
	};

	return (
		<div>
			<div className="activos-top">
				<div className="flex flex-col px-4 circulos-activos">
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
					<div className="">
						<StatsCard stats={stats} />
					</div>
				</div>
				<div className="diagrama-red">
					{/*<img src={placeholder}></img>*/}
				</div>
			</div>
			<div className="tabla-vulnerabilidades">
				<EditableTable
					columns={columns}
					initialData={initialData}
					editableColumns={editableColumns}
					dropdownOptions={dropdownOptions}
				/>
			</div>
		</div>
	);
}

export default Vulnerabilidades;
