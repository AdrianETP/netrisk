import { Typography } from "@mui/material";
import ProgressCircle from "../Components/ProgressCircle.jsx";
import "./dashboard.css";
import { LineChart } from "@mui/x-charts/LineChart";


function Dashboard() {


	return (
		<div className="p-4">
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
					height={200}
					margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
				/>
			</div>
		</div>
	);
}

export default Dashboard;
