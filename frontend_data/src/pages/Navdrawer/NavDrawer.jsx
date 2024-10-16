import {
	Drawer,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	Box,
	Typography,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ScatterPlotOutlinedIcon from "@mui/icons-material/ScatterPlotOutlined";
import React, { useState } from "react";
import "../../assets/logo.jpeg";
import { useNavigate } from "react-router-dom"; // Import useNavigate


function NavDrawer() {
	const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user"))); // State to hold user info
	const navigate = useNavigate(); // Initialize navigate




	const drawerItems = {
		admin: [
			{
				title: "Análisis y gestión de riesgos",
				items: [
					{
						title: "Panel de control",
						icon: <DashboardOutlinedIcon fontSize="small" />,
						path: "/dashboard",
					},
					{
						title: "Gestión de activos",
						icon: <ScatterPlotOutlinedIcon fontSize="small" />,
						path: "/activos",
					},
					{
						title: "Evaluación de vulnerabilidades",
						icon: <InventoryOutlinedIcon fontSize="small" />,
						path: "/vulnerabilidades",
					},
					{
						title: "Controles de seguridad",
						icon: <ShieldOutlinedIcon fontSize="small" />,
						path: "/controles",
					},
					{
						title: "Roles",
						icon: <BusinessOutlinedIcon fontSize="small" />,
						path: "/roles",
					},
					{
						title: "Personas",
						icon: <PeopleAltOutlinedIcon fontSize="small" />,
						path: "/personas",
					},
				],
			},
			{
				title: "Administración",
				items: [
					{
						title: "Generación de reportes",
						icon: <SummarizeOutlinedIcon fontSize="small" />,
						path: "/reportes",
					},
					{
						title: "Administración de auditorías",
						icon: <AccessTimeOutlinedIcon fontSize="small" />,
						path: "/auditorias",
					},
					{
						title: "Gestión de accesos",
						icon: <ManageAccountsOutlinedIcon fontSize="small" />,
						path: "/accesos",
					},
					{
						title: "Soporte y ayuda",
						icon: <HelpOutlineOutlinedIcon fontSize="small" />,
						path: "/soporte",
					},
				],
			},
		],
		user: [
			{
				title: "Análisis y gestión de riesgos",
				items: [
					{
						title: "Panel de control",
						icon: <DashboardOutlinedIcon fontSize="small" />,
					},
					{
						title: "Gestión de activos",
						icon: <ScatterPlotOutlinedIcon fontSize="small" />,
					},
					{
						title: "Evaluación de vulnerabilidades",
						icon: <InventoryOutlinedIcon fontSize="small" />,
					},
					{
						title: "Controles de seguridad",
						icon: <ShieldOutlinedIcon fontSize="small" />,
					},
					{ title: "Roles", icon: <BusinessOutlinedIcon fontSize="small" /> },
					{
						title: "Personas",
						icon: <PeopleAltOutlinedIcon fontSize="small" />,
					},
				],
			},
			{
				title: "Administración",
				items: [
					{
						title: "Generación de reportes",
						icon: <SummarizeOutlinedIcon fontSize="small" />,
					},
					{
						title: "Soporte y ayuda",
						icon: <HelpOutlineOutlinedIcon fontSize="small" />,
					},
				],
			},
		],
	};

	const itemsToDisplay =
		user.role === "admin" ? drawerItems.admin : drawerItems.user;

	return (
		<Drawer
			variant="permanent"
			anchor="left"
			sx={{
				width: "21vw",
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: "21vw",
					bgcolor: "transparent",
					background: "linear-gradient(180deg, #095459, #292929)", // Gradiente
					color: "#fff",
					borderTopRightRadius: "10px", // Round top-right corner
					borderBottomRightRadius: "10px", // Round bottom-right corner
				},
			}}
		>
			{/* Header con el logo de la herramienta */}
			<Box
				sx={{
					display: "flex",
					alignItems: "left",
					flexDirection: "column",
					padding: 3,
					pb: 0,
				}}
			>
				<img
					src={"src/assets/logo.jpeg"}
					style={{
						width: 100,
						height: "auto",
						borderRadius: 10,
						marginBottom: 8,
						mixBlendMode: "color-dodge", // Simulating color dodge
					}}
				/>
				<Typography
					variant="h6"
					sx={{
						fontSize: "18px", // Custom font size for name
						fontWeight: "bold", // Custom font weight
						color: "#fff", // Custom font color
					}}
				>
					{user.name}
				</Typography>
				<Typography variant="body2" sx={{ color: "#ddd" }}>
					{user.email}
				</Typography>
			</Box>

			{/* Lista de elementos del menú */}
			<List>
				{itemsToDisplay.map((section) => (
					<React.Fragment key={section.title}>
						<ListSubheader
							sx={{
								bgcolor: "transparent",
								color: "#fff",
								fontSize: "14px",
								fontWeight: "semibold",
								pt: "10px",
							}}
						>
							{section.title}
						</ListSubheader>
						{section.items.map((item) => (
							<ListItem
								button
								key={item.title}
								dense
								onClick={() => navigate(item.path)} // Navigate on click
								sx={{
									"&:hover": {
										backgroundColor: "rgba(255, 255, 255, 0.1)", // Lighten on hover
										transition: "background-color 0.3s ease", // Smooth transition effect
									},
									"&.Mui-selected": {
										backgroundColor: "#1e88e5", // Background color when selected
										color: "#fff",
										animation: "pop 0.2s ease", // Apply pop animation on click
									},
									"&.Mui-selected:hover": {
										backgroundColor: "rgba(255, 255, 255, 0.2)", // Lighten on hover
										transition: "background-color 0.3s ease", // Smooth transition effect
									},
									paddingLeft: 3, // Add right padding
								}}
							>
								{item.icon}
								<ListItemText
									primary={item.title}
									sx={{
										marginLeft: 2,
										fontSize: "14px",
										fontWeight: "medium",
										"& .css-6kidbv-MuiTypography-root": {
											fontSize: "14px",
											fontWeight: "300",
										},
									}}
								/>
							</ListItem>
						))}
					</React.Fragment>
				))}
			</List>
		</Drawer>
	);
}



export default NavDrawer;
