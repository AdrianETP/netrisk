import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Correct import
import { AuthProvider } from "./AuthContext";
import { NextUIProvider } from "@nextui-org/react";
//import { ProtectedRoute } from "./ProtectedRoute.jsx"; // importar protected routes
import MainLayout from "./pages/MainLayout.jsx";
import NotFound from "./pages/ErrorHandling/NotFound";
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import Activos from "./pages/Activos/activos.jsx";
import Vulnerabilidades from "./pages/Vulnerabilidades/vulnerabilidades.jsx";
import Controles from "./pages/Controles/controles.jsx";
import Roles from "./pages/Roles/roles.jsx";
import Personas from "./pages/Personas/personas.jsx";
import Reportes from "./pages/Reportes/reportes.jsx";
import Auditorias from "./pages/Auditorias/auditorias.jsx";
import Accesos from "./pages/Accesos/accesos.jsx";
import Soporte from "./pages/Soporte/soporte.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import { CssBaseline } from "@mui/material";

function App() {

	const THEME = createTheme({
		typography: {
			fontFamily: `"Inter", "Helvetica", "Arial", sans-serif`,
			fontSize: 14,
			fontWeightLight: 300,
			fontWeightRegular: 400,
			fontWeightMedium: 500,
		},
		palette: {
			mode: "dark", // Set the default mode to dark
			background: {
				default: "#202020", // Default background color
			},
			text: {
				primary: "#ffffff", // Default text color
			},
		},
	});

	return (
		<NextUIProvider>
			<ThemeProvider theme={THEME}>
				<CssBaseline />
				<AuthProvider>
					<Router>
						<Routes>
							{/* Login */}
							<Route path="/login" element={<LoginPage />} />

							{/* Error handling */}
							<Route path="*" element={<NotFound />} />

							{/* All other routes wrapped with MainLayout (nav drawer)*/}
							<Route element={<MainLayout />}>
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/activos" element={<Activos />} />
								<Route
									path="/vulnerabilidades"
									element={<Vulnerabilidades />}
								/>
								<Route path="/controles" element={<Controles />} />
								<Route path="/roles" element={<Roles />} />
								<Route path="/personas" element={<Personas />} />
								<Route path="/reportes" element={<Reportes />} />
								<Route path="/auditorias" element={<Auditorias />} />
								<Route path="/accesos" element={<Accesos />} />
								<Route path="/soporte" element={<Soporte />} />

								{/* <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>} /> */}
							</Route>
						</Routes>
					</Router>
				</AuthProvider>
			</ThemeProvider>
		</NextUIProvider>
	);
}

export default App;
