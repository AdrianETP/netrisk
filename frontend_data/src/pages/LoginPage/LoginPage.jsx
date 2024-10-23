import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./LoginPage.css";
import { Input } from "@nextui-org/react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import { Typography } from "@mui/material";
import { Button } from "@nextui-org/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../../AuthContext.jsx";

const LoginPage = () => {
	const { login } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [userData, setUserData] = useState(null);
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			// Sign in with Firebase Auth and await the user credential
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Fetch user data from Firestore
			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const userData = docSnap.data();
				login(userData); // Store user data in context
				navigate("/dashboard"); // Navigate to the dashboard after successful login
			} else {
				console.log("No se encontraron datos del usuario");
			}
		} catch (err) {
			toast.error(
				"Error al iniciar sesión, por favor revisa tus credenciales."
			);
			console.error(err);
		}
	};

	return (
		<div className="loginBackground">
			<ToastContainer />
			<div className="glass-card ">
				<div className="logo-container-login">
					<img
						src={"src/assets/logo.jpeg"}
						style={{
							width: 100,
							height: "auto",
							borderRadius: 10,
							marginBottom: 10,
						}}
					/>
				</div>
				<Typography
					variant="h6"
					sx={{
						fontSize: "30px",
						fontWeight: "bold",
						marginBottom: "15px",
					}}
				>
					Iniciar sesión
				</Typography>
				<Input
					label="Correo"
					color="default"
					variant="bordered"
					startContent={<EmailOutlinedIcon />}
					labelPlacement="outside"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="input-spacing"
					classNames={{
						inputWrapper: ["border-white"],
					}}
				/>
				<Input
					label="Contraseña"
					color="default"
					variant="bordered"
					startContent={<HttpsOutlinedIcon />}
					labelPlacement="outside"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="input-spacing"
					classNames={{
						inputWrapper: ["border-white"],
					}}
				/>

				<div className="login-button-container">
					<Button
						onClick={handleLogin}
						color="default"
						variant="shadow"
						className="login-button"
					>
						Iniciar sesión
					</Button>
				</div>

				{error && <p>{error}</p>}
			</div>
		</div>
	);
};

export default LoginPage;
