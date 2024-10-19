import "./SmallStatsCard.css";
import { Typography } from "@mui/material";

function SmallStatsCard({text, icon, stat }) {
    return (
			<div className="stats-card-sm">
				<div className="stats-card-sm-title">
					{icon}
					<Typography
						variant="h6"
						sx={{
							fontSize: "14px",
							fontWeight: "normal",
							color: "#E8E8E8",
							textAlign: "left",
						}}
					>
						{text}
					</Typography>
				</div>
				<Typography
					variant="h6"
					sx={{
						fontSize: "24px",
						fontWeight: "semibold",
						color: "#f2f2f2",
						textAlign: "left",
					}}
				>
					{stat}
				</Typography>
			</div>
		);
}

export default SmallStatsCard;