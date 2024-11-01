import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/react";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PolicyRoundedIcon from "@mui/icons-material/PolicyRounded";
import { Typography } from "@mui/material";
import { DatePicker } from "@nextui-org/react";
import { ZonedDateTime } from "@internationalized/date";
import EditableTable from "../Components/EditableTable.jsx";
import "./auditorias.css";
import { get } from "../../ApiRequests.js";

function Auditorias() {
	const [audits, setAudits] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [recurrencia, setRecurrencia] = useState("");
	const [proximaAuditoria, setProximaAuditoria] = useState(null);

	useEffect(() => {
		get("api/auditorias")
			.then((result) => {
				setAudits(result.data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		get("api/configuracion")
			.then((result) => {
				setRecurrencia(result.data.recurrencia);
				// Convert the date string to ZonedDateTime if it exists
				if (result.data.prox_auditoria) {
					setProximaAuditoria(ZonedDateTime.from(result.data.prox_auditoria));
				} else {
					setProximaAuditoria(null);
				}
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
				setIsLoading(false);
			});
	}, []);

	const columns = [
		{ key: "numeroAuditoria", label: "NÚMERO DE AUDITORÍA" },
		{ key: "fecha", label: "FECHA" },
		{ key: "estado", label: "ESTADO" },
		{ key: "reporteGenerado", label: "REPORTE GENERADO" },
	];

	const recurrencias = [
		{ key: "semanal", label: "Recurrencial semanal" },
		{ key: "bisemanal", label: "Recurrencial bisemanal" },
		{ key: "mensual", label: "Recurrencial mensual" },
		{ key: "bimestral", label: "Recurrencial bimestral" },
		{ key: "trimestral", label: "Recurrencial trimestral" },
	];

	const handleRecurrenciaChange = (value) => {
		setRecurrencia(value);
		// Aquí podrías agregar lógica para actualizar la configuración en el backend
	};

	const handleDateChange = (date) => {
		setProximaAuditoria(date); // Ensure this is a valid ZonedDateTime or null
		// Aquí podrías agregar lógica para actualizar la configuración en el backend
	};

	return (
		<div>
			<div className="flex flex-col p-6 gap-4 py-2 pb-4">
				<div className="flex flex-row gap-4">
					<Select
						items={recurrencias}
						labelPlacement="outside"
						label="Configuración actual"
						variant="bordered"
						placeholder="Recurrencia no seleccionada"
						className="max-w-xs"
						selectedKey={recurrencia}
						onSelectionChange={handleRecurrenciaChange}
					>
						{(recurrencia) => <SelectItem>{recurrencia.label}</SelectItem>}
					</Select>
					<DatePicker
						label="Próxima auditoría programada"
						variant="bordered"
						labelPlacement="outside"
						placeholderValue={proximaAuditoria || null} // Pass null if undefined
						onChange={handleDateChange}
						className="max-w-xs"
						hideTimeZone
						showMonthAndYearPickers
					/>
				</div>
				<Button
					color="default"
					size="small"
					endContent={<BoltRoundedIcon fontSize="medium" />}
					className="px-14 w-1/4"
				>
					Iniciar auditoría
				</Button>
			</div>
			<div className="audit-container">
				<div className="audit-titulo">
					<PolicyRoundedIcon fontSize="large" />
					<Typography
						variant="h6"
						sx={{
							fontSize: "20px",
							fontWeight: "normal",
							width: "30vw",
						}}
					>
						Auditorías registradas
					</Typography>
				</div>

				<div className="tabla-auditorias">
					<EditableTable
						columns={columns}
						initialData={audits}
						editableColumns={[]}
						dropdownOptions={{}}
						baseHeight="max-h-[300px]"
					/>
				</div>
			</div>
		</div>
	);
}

export default Auditorias;
