import ProgressCircle from "../Components/ProgressCircle.jsx";
import EditableTable from "../Components/EditableTable.jsx";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { Button } from "@nextui-org/button";
import "./activos.css";
import { get } from "../../ApiRequests.js";
import { useState, useEffect} from "react";


function Activos() {

	const [activos, setActivos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		get("api/activos")
			.then((result) => {
				setActivos(result);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
				setIsLoading(false);
			});
	}, []);

	const columns = [
		{ key: "idTabla", label: "ID" },
		{ key: "ip", label: "IP" },
		{ key: "macAddress", label: "MAC ADDRESS" },
		{ key: "device", label: "DISPOSITIVO" },
		{ key: "operatingSystem", label: "SISTEMA OPERATIVO" },
		{ key: "desc", label: "DESCRIPCIÓN" },
		{ key: "impact", label: "IMPACTO" },
	];

	const initialData = [
		{
			id: 1,
			idTabla: "Router1",
			ip: "192.168.0.1",
			macAddress: "00:0a:95:9d:68:16",
			device: "Router",
			operatingSystem: "Linux",
			desc: "",
			impact: "Crítico",
		},
		{
			id: 2,
			idTabla: "PC2",
			ip: "192.168.0.2",
			macAddress: "00:0a:95:9d:68:17",
			device: "PC",
			operatingSystem: "Windows 10",
			desc: "Dispositivo 2",
			impact: "Alto",
		},
		{
			id: 3,
			idTabla: "Servidor3",
			ip: "192.168.0.3",
			macAddress: "00:0a:95:9d:68:18",
			device: "Servidor",
			operatingSystem: "Ubuntu",
			desc: "Dispositivo 3",
			impact: "Moderado",
		},
		{
			id: 4,
			idTabla: "Smartphone4",
			ip: "192.168.0.4",
			macAddress: "00:0a:95:9d:68:19",
			device: "Smartphone",
			operatingSystem: "Android",
			desc: "Dispositivo 4",
			impact: "Bajo",
		},
	];

	const editableColumns = ["desc"];
	const dropdownOptions = [""];


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
							label="Activos digitales"
						/>
						<ProgressCircle
							progressValue={75} // Controls the progress bar percentage
							displayValue="75%" // The value shown inside the circle
							customColor="#0DD4CE"
							size={170}
							strokeWidth={9}
							label="Categorización"
						/>
					</div>
					<div className="boton-escaneo-red">
						<Button
							color="default"
							endContent={<LanguageOutlinedIcon />}
							className="px-6"
						>
							Iniciar escaneo de red
						</Button>
					</div>
				</div>
				<div className="diagrama-red">
					{/*<img src={placeholder}></img>*/}
				</div>
			</div>
			<div className="tabla-activos">
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

export default Activos;
