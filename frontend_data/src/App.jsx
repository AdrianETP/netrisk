import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { NextUIProvider } from "@nextui-org/react";
import MainLayout from "./pages/MainLayout";
import LoginPage from "./pages/LoginPage/LoginPage";
// import HomePage from "./pages/HomePage";
// import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/ErrorHandling/NotFound";

function App() {
    return (
        <AuthProvider>
            <NextUIProvider>
                <Router>
                    <Routes>
                        {/* Login */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Error handling */}
                        <Route path="*" element={<NotFound />} />

                        {/* All other routes wrapped with MainLayout (nav drawer)*/}
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            {/* <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>} /> */}
                            {/* Add other protected routes here */}
                        </Route>
                    </Routes>
                </Router>
            </NextUIProvider>
        </AuthProvider>
    );
}

export default App;
