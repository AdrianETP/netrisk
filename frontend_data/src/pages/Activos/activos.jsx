import React from "react";
import ProgressCircle from "../Components/ProgressCircle.jsx";
import EditableTable from "../Components/EditableTable.jsx";

function Activos() {

	const activos = [
		{
			ip: "192.168.1.1",
			mac_address: "00:1A:2B:3C:4D:5E",
			dispositivos: "Laptop",
			sistema_operativo: "Windows 10",
			nombre: "Usuario1",
			impacto: "Alto",
		},
		{
			ip: "192.168.1.2",
			mac_address: "00:1A:2B:3C:4D:5F",
			dispositivos: "Smartphone",
			sistema_operativo: "Android 12",
			nombre: "Usuario2",
			impacto: "Medio",
		},
		{
			ip: "192.168.1.3",
			mac_address: "00:1A:2B:3C:4D:60",
			dispositivos: "Servidor",
			sistema_operativo: "Ubuntu 20.04",
			nombre: "Servidor Principal",
			impacto: "Crítico",
		},
		{
			ip: "192.168.1.4",
			mac_address: "00:1A:2B:3C:4D:61",
			dispositivos: "Impresora",
			sistema_operativo: "Firmware Proprietario",
			nombre: "Impresora Oficina",
			impacto: "Bajo",
		},
		{
			ip: "192.168.1.5",
			mac_address: "00:1A:2B:3C:4D:62",
			dispositivos: "PC de escritorio",
			sistema_operativo: "Windows 11",
			nombre: "Usuario3",
			impacto: "Alto",
		},
	];

	const initialData = [
		{
			ip: "192.168.1.1",
			mac_address: "00:1A:2B:3C:4D:5E",
			dispositivos: "Laptop",
			sistema_operativo: "Windows 10",
			nombre: "Usuario1",
			impacto: "Alto",
			isEditing: false,
		},
		{
			ip: "192.168.1.2",
			mac_address: "00:1A:2B:3C:4D:5F",
			dispositivos: "Smartphone",
			sistema_operativo: "Android 12",
			nombre: "Usuario2",
			impacto: "Medio",
			isEditing: false,
		},
		// Add more rows as needed...
	];

	const columns = [
		{ header: "IP", accessor: "ip" },
		{ header: "MAC Address", accessor: "mac_address" },
		{ header: "Dispositivos", accessor: "dispositivos", isEditable: true },
		{
			header: "Sistema Operativo",
			accessor: "sistema_operativo",
			isEditable: true,
		},
		{ header: "Nombre", accessor: "nombre", isEditable: true },
		{ header: "Impacto", accessor: "impacto" },
	];

	return (
		<div>
			<div className="flex flex-row p-4">
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
			<div>
				<EditableTable/>
			</div>
		</div>
	);
}

export default Activos;
