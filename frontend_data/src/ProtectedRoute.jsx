import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ children }) => {
	const { user } = useAuth();
	const location = useLocation();

	if (!user) {
		// Redirect to login page and preserve the current path
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
};


