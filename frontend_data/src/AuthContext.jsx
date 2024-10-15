import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./firebase"; // Import the auth and db instances from your firebase.js
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged from Firebase Auth
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // null when not logged in

	useEffect(() => {
		// Check session storage for user data on mount
		const storedUser = JSON.parse(sessionStorage.getItem("user"));
		if (storedUser) {
			setUser(storedUser);
		}

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				// Fetch user data from Firestore
				const docRef = doc(db, "users", user.uid);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const userData = docSnap.data();
					const userInfo = {
						uid: user.uid,
						email: user.email,
						name: userData.name, // Assuming 'name' is in your Firestore user data
						role: userData.role, // Assuming 'role' is in your Firestore user data
					};

					setUser(userInfo);
					// Save user data to session storage
					sessionStorage.setItem("user", JSON.stringify(userInfo));
				} else {
					console.log("No user data found");
					setUser(null);
				}
			} else {
				setUser(null);
				sessionStorage.removeItem("user"); // Clear session storage if user is logged out
			}
		});

		return () => unsubscribe(); // Cleanup subscription on unmount
	}, []);

	const login = (userData) => {
		const userInfo = {
			uid: userData.uid,
			email: userData.email,
			name: userData.name,
			role: userData.role,
		};

		setUser(userInfo); // Set the user data when logged in
		// Save user data to session storage
		sessionStorage.setItem("user", JSON.stringify(userInfo));
	};

	const logout = () => {
		setUser(null); // Clear the user data when logged out
		sessionStorage.removeItem("user"); // Clear session storage
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
