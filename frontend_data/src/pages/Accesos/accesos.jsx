import { Button } from "@nextui-org/button";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { Typography } from "@mui/material";
import EditableTable from "../Components/EditableTable.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.js"; // Import the Firestore instance
import { useEffect, useState } from "react";
import "./accesos.css";


function Accesos() {
	const [userData, setUserData] = useState([]);

	const columns = [
		{ key: "name", label: "NOMBRE" },
		{ key: "email", label: "CORREO" },
		{ key: "role", label: "ROL" },
	];

	const editableColumns = ["role"];
	const dropdownOptions = { role: ["admin", "user"] };

	// Fetch data from Firestore
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "users")); // Adjust the collection name if needed
				const userData = querySnapshot.docs
					.map((doc) => ({
						id: doc.id, // Optional: Add document ID if needed
						...doc.data(),
					}))
					// Filter to include only users with "admin" or "user" role
					.filter((user) => user.role === "admin" || user.role === "user");

				setUserData(userData);
			} catch (error) {
				console.error("Error fetching user data: ", error);
			}
		};

		fetchUserData();
		console.log(userData);
	}, []);

	return (
		<div>
			
			<div className="audit-container">
				<div className="audit-titulo">
					<PeopleAltRoundedIcon fontSize="large" />
					<Typography
						variant="h6"
						sx={{
							fontSize: "20px",
							fontWeight: "normal",
							width: "30vw",
						}}
					>
						Usuarios registrados
					</Typography>
					<Button
						color="default"
						size="small"
						endContent={<PersonAddAltRoundedIcon fontSize="medium" />}
						className="px-14 w-1/4 ml-20"
					>
						Agregar usuario
					</Button>
				</div>

				<div className="tabla-users">
					<EditableTable
						columns={columns}
						initialData={userData}
						editableColumns={editableColumns}
						dropdownOptions={dropdownOptions}
						baseHeight="max-h-[300px]"
					/>
				</div>
			</div>
		</div>
	);
}

export default Accesos;
