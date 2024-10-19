import SmallStatsCard from "../Controles/Components/SmallStatsCard.jsx";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import RecentActorsRoundedIcon from "@mui/icons-material/RecentActorsRounded";
import { Typography } from "@mui/material";
import { Progress } from "@nextui-org/react";
import "./roles.css";


function Roles() {
const stats = [
	{
		title: "Cumplidos",
		icon: <CheckCircleOutlineRoundedIcon fontSize="14px" htmlColor="#17C964" />,
		value: "100",
	},
	{
		title: "En proceso",
		icon: <AccessTimeRoundedIcon fontSize="14px" htmlColor="#F5A524" />,
		value: "100",
	},
	{
		title: "Sin cumplir",
		icon: <HighlightOffRoundedIcon fontSize="14px" htmlColor="#F31260" />,
		value: "100",
	},
	
];

	return (
		<div>
			<div className="flex flex-row gap-4 p-4 ">
				{stats.map((stat, index) => (
					<SmallStatsCard
						key={index}
						text={stat.title}
						icon={stat.icon}
						stat={stat.value}
					/>
				))}
				<Progress
					aria-label="Cumplimiento de roles"
					label="Cumplimiento de roles"
					size="lg"
					value={60}
					color="success"
					showValueLabel={true}
					className="w-1/3 mx-auto self-center"
					radius="sm"
				/>
			</div>
			<div className="gestion-roles-container">
				<div className="gestion-roles-titulo">
					<RecentActorsRoundedIcon fontSize="large" />
					<Typography
						variant="h6"
						sx={{
							fontSize: "20px",
							fontWeight: "normal",
							width: "30vw",
						}}
					>
						Gestión de roles
					</Typography>
				</div>
				<div></div>
			</div>
		</div>
	);
}
export default Roles;
