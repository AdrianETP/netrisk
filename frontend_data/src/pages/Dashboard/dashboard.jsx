import { Typography } from "@mui/material";
import ProgressCircle from "../Components/ProgressCircle.jsx";
import "./dashboard.css";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

function Dashboard() {
	// Define a custom color palette
	const customPalette = [
		"#0DD4CE",
		"#F46197",
		"#ECFFB0",
		"#54577C",
		"#4A7B9D",
	];

	const desktopOS = [
		{
			label: "Windows",
			value: 72.72,
		},
		{
			label: "OS X",
			value: 16.38,
		},
		{
			label: "Linux",
			value: 3.83,
		},
		{
			label: "Chrome OS",
			value: 2.42,
		},
		{
			label: "Other",
			value: 4.65,
		},
	];

	return (
		<div className="flex flex-row flex-wrap p-6 pt-0 items-center gap-y-4 gap-x-6">
			<div className="card-background-dashboard">
				<Typography>Historial de NetScore</Typography>
				<LineChart
					xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
					series={[
						{
							data: [2, 5.5, 2, 8.5, 1.5, 5],
						},
					]}
					width={350}
					height={191}
					margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
				/>
			</div>
			<div className="justify-center -mr-5">
				<ProgressCircle
					progressValue={100} // Controls the progress bar percentage
					displayValue="100" // The value shown inside the circle
					customColor="#0DD4CE"
					size={170}
					strokeWidth={9}
					label="NetScore"
				/>
			</div>
			<div className="card-background-dashboard">
				<Typography>Vulnerabilidades por categoría</Typography>
				<PieChart
					series={[
						{
							data: desktopOS.map((item, index) => ({
								...item,
								color: customPalette[index % customPalette.length], // Assign colors cyclically from the palette
							})),
							highlightScope: { fade: "global", highlight: "item" },
							faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
						},
					]}
					height={191}
					width={380}
					margin={{ left: 0, right: 150, top: 15, bottom: 15 }}
				/>
			</div>
			<div className="card-background-dashboard">
				<Typography>Vulnerabilidades por activos</Typography>
				<BarChart
					xAxis={[
						{ scaleType: "band", data: ["group A", "group B", "group C"] },
					]}
					series={[
						{ data: [4, 3, 5] },
						{ data: [1, 6, 3] },
						{ data: [2, 5, 6] },
					]}
					width={460}
					height={191}
					margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
				/>
			</div>
			<div className="card-background-dashboard">
				<Typography>Porcentaje de remediación de vulnerabilidades</Typography>
				<LineChart
					xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
					series={[
						{
							data: [2, 5.5, 2, 8.5, 1.5, 5],
							color: "#F46197",
						},
					]}
					width={460}
					height={191}
					margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
				/>
			</div>
		</div>
	);
}

export default Dashboard;
