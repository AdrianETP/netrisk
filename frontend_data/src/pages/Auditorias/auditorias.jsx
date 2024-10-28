import { useState } from "react";
import { DateRangePicker } from "@nextui-org/date-picker";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/react";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PolicyRoundedIcon from "@mui/icons-material/PolicyRounded";
import { Typography } from "@mui/material";
import { DatePicker } from "@nextui-org/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import EditableTable from "../Components/EditableTable.jsx";
import "./auditorias.css";

function Auditorias() {
	
	const auditData = [
		{
			id: 1,
			numeroAuditoria: "001",
			fecha: "2024-10-18",
			estado: "Completada",
			reporteGenerado: "2024-10-18",
		},
		{
			id: 2,
			numeroAuditoria: "002",
			fecha: "2024-10-17",
			estado: "Completada",
			reporteGenerado: "2024-10-18",
		},
		{
			id: 3,
			numeroAuditoria: "003",
			fecha: "2024-10-19",
			estado: "Completada",
			reporteGenerado: "2024-10-18",
		},
		{
			id: 4,
			numeroAuditoria: "004",
			fecha: "2024-10-15",
			estado: "Completada",
			reporteGenerado: "2024-10-18",
		},
		{
			id: 5,
			numeroAuditoria: "005",
			fecha: "2024-10-16",
			estado: "Completada",
			reporteGenerado: "2024-10-18",
		},
		{
			id: 6,
			numeroAuditoria: "006",
			fecha: "2024-10-18",
			estado: "Completada",
			reporteGenerado: "2024-10-18",
		},
		{
			id: 7,
			numeroAuditoria: "007",
			fecha: "2024-10-17",
			estado: "Completada",
			reporteGenerado: "2024-10-18",
		},
		{
			id: 8,
			numeroAuditoria: "008",
			fecha: "2024-10-19",
			estado: "Completada",
			reporteGenerado: "2024-10-18",
		},
		{
			id: 9,
			numeroAuditoria: "009",
			fecha: "2024-10-15",
			estado: "Completada",
			reporteGenerado: "2024-10-18",
		},
		{
			id: 10,
			numeroAuditoria: "010",
			fecha: "2024-10-16",
			estado: "Completada",
			reporteGenerado: "2024-10-18",
		},
	];

	const columns = [
		{ key: "numeroAuditoria", label: "NÚMERO DE AUDITORÍA" },
		{ key: "fecha", label: "FECHA" },
		{ key: "estado", label: "ESTADO" },
		{ key: "reporteGenerado", label: "REPORTE GENERADO" },
	];


	const editableColumns = [];
	const dropdownOptions = {
		
	};

	const recurrencias = [
		{ key: "semanal", label: "Recurrencial semanal" },
		{ key: "bisemanal", label: "Recurrencial bisemanal" },
		{ key: "mensual", label: "Recurrencial mensual" },
		{ key: "bimestral", label: "Recurrencial bimestral" },
		{ key: "trimestral", label: "Recurrencial trimestral" },
	];


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
					>
						{(recurrencia) => <SelectItem>{recurrencia.label}</SelectItem>}
					</Select>
					<DatePicker
						label="Próxima auditoría programada"
						variant="bordered"
						labelPlacement="outside"
						defaultValue={now(getLocalTimeZone())}
						hideTimeZone
						showMonthAndYearPickers
						className="max-w-xs"
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
						initialData={auditData}
						editableColumns={editableColumns}
						dropdownOptions={dropdownOptions}
						baseHeight="max-h-[300px]"
					/>
				</div>
			</div>
		</div>
	);
}

export default Auditorias;
