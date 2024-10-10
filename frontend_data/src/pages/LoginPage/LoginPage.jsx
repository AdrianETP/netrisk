import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const handleLogin = () => {
        // Perform authentication logic here
        const userData = { name: "User" }; // Replace with real user data
        login(userData);

        // Redirect to the original page or dashboard
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
    };

    return (
        <div>
            <h2>Login Page</h2>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
