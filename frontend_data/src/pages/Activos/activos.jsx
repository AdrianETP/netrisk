import ProgressCircle from "../Components/ProgressCircle.jsx";
import EditableTable from "../Components/EditableTable.jsx";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { Button } from "@nextui-org/button";
import "./activos.css";
import { get } from "../../ApiRequests.js";
import { useState, useEffect } from "react";

function Activos() {
	const [activos, setActivos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [progressDigital, setProgressDigital] = useState(0);
	const [progressCategorizacion, setProgressCategorizacion] = useState(0);

	useEffect(() => {
		get("api/activos")
			.then((result) => {
				setActivos(result.data);
				setIsLoading(false);
				console.log(result.data);

				// Aquí calculamos los valores para los círculos de progreso
				const totalActivos = result.data.length;
				const activosCategorizados = result.data.filter(
					(activo) => activo.desc
				).length; // Ajusta la condición según tus datos

				// Calculamos los porcentajes
				setProgressDigital(totalActivos);
				setProgressCategorizacion(
					(activosCategorizados / totalActivos) * 100 || 0
				);
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

	const editableColumns = ["desc"];
	const dropdownOptions = [""];

	return (
		<div>
			<div className="activos-top">
				<div className="flex flex-col px-4 circulos-activos">
					<div className="flex flex-row p-4 gap-4 mb-2">
						<ProgressCircle
							progressValue={100} // Valor de progreso dinámico
							displayValue={`${progressDigital}`} // Muestra el valor redondeado
							customColor="#0DD4CE"
							size={170}
							strokeWidth={9}
							label="Activos digitales"
						/>
						<ProgressCircle
							progressValue={progressCategorizacion} // Valor de progreso dinámico
							displayValue={`${Math.round(progressCategorizacion)}%`} // Muestra el valor redondeado
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
				<div className="diagrama-red">{/*<img src={placeholder}></img>*/}</div>
			</div>
			<div className="tabla-activos">
				<EditableTable
					columns={columns}
					initialData={activos}
					editableColumns={editableColumns}
					dropdownOptions={dropdownOptions}
				/>
			</div>
		</div>
	);
}

export default Activos;
