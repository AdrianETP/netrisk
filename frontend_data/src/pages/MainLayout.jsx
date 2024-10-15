import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavDrawer from "./Navdrawer/NavDrawer";
import { Typography, Box } from "@mui/material";
import { useAuth } from "../AuthContext.jsx";
import { Button } from "@nextui-org/button";
import "./MainLayout.css";

function MainLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAuth(); // Assuming you have a logout function in your AuthContext

	// Hide NavDrawer on login page
	const isLoginPage = location.pathname === "/login";

	// Set the page title 
	const getPageTitle = () => {
		switch (location.pathname) {
			case "/dashboard":
				return "Panel de control";
			case "/activos":
				return "Gestión de activos";
			case "/vulnerabilidades":
				return "Evaluación de vulnerabilidades";
			case "/controles":
				return "Controles de seguridad";
			case "/roles":
				return "Roles";
			case "/personas":
				return "Personas";
			case "/reportes":
				return "Generación de reportes";
			case "/auditorias":
				return "Administración de auditorías";
			case "/accesos":
				return "Gestión de accesos";
			case "/soporte":
				return "Soporte y ayuda";
			default:
				return ""; // Default 
		}
	};

	return (
		<Box sx={{ display: "flex"}}>
			{!isLoginPage && <NavDrawer />}{" "}
			{/* Only show NavDrawer if not on login page */}
			<div>
				{/* Header with Title and Logout Button */}
				<div className="navbar-container">
					{/* Title */}
					<Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold", fontSize:"28px", }}>
						{getPageTitle()}
					</Typography>

					{/* Logout */}
					{!isLoginPage && (
						<Button
							variant="solid"
							color="default"
							onClick={() => {
								logout(); 
								navigate("/login"); 
							}}
						>
							Cerrar sesión
						</Button>
					)}
				</div>

				{/* Render Outlet for nested routes */}
				<Box sx={{ height: "88vh"}}>
					<Outlet /> {/* This renders the nested routes (pages) */}
				</Box>
			</div>
		</Box>
	);
}

export default MainLayout;
