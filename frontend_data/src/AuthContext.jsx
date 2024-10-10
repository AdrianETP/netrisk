// src/AuthContext.js

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // null when not logged in

	const login = (userData) => {
		setUser(userData); // Set the user data when logged in
	};

	const logout = () => {
		setUser(null); // Clear the user data when logged out
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
