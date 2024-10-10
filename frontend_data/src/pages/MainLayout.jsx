import { Outlet, useLocation } from "react-router-dom";
import NavDrawer from "./NavDrawer"; // This will be your drawer component
import { useAuth } from "./auth"; // Hook to get auth and role details

function MainLayout() {
    const location = useLocation();
    const { user } = useAuth(); // Replace with your actual auth logic

    // Hide NavDrawer on login page
    const isLoginPage = location.pathname === "/login";

    return (
        <div>
            {!isLoginPage && <NavDrawer role={user?.role} />}{" "}
            {/* Only show NavDrawer if not on login page */}
            <div className="main-content">
                <Outlet /> {/* This renders the nested routes (pages) */}
            </div>
        </div>
    );
}

export default MainLayout;
