import React from "react";
import "./StatsCard.css";
import { Typography } from "@mui/material";


const StatsCard = ({ stats }) => {
	return (
		<div className="stats-card">
			<Typography
				variant="h6"
				sx={{
					fontSize: "16px",
					fontWeight: "semibold",
					color: "#E8E8E8",
					textAlign: "center",
					marginBottom: "10px",
				}}
			>
				Vulnerabilidades por impacto
			</Typography>
			<div className="stat">
				{stats.map((stat, index) => (
					<div
						key={index}
						style={{
							display: "flex",
							alignItems: "center",
                            color: stat.color,
     
						}}
					>
						{stat.icon}
						<Typography
							variant="h4"
							sx={{
								fontSize: "24px",
								fontWeight: "bold",
								color: "#E8E8E8",
								paddingLeft: "5px"
								
							}}
						>
							{stat.value}
						</Typography>
					</div>
				))}
			</div>
		</div>
	);
};

export default StatsCard;
