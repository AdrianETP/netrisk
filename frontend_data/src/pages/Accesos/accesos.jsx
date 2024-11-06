import { Button } from "@nextui-org/button";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import { Box, Typography } from "@mui/material";
import EditableTable from "../Components/EditableTable.jsx";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.js"; // Import the Firestore instance
import { useEffect, useState } from "react";
import "./accesos.css";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from "@nextui-org/react";

function Accesos() {
	const [userData, setUserData] = useState([]);
	const [nonUsers, setNonUsers] = useState([]);
	const modal = useDisclosure();
	const [loading, setLoading] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]);

	const columns = [
		{ key: "name", label: "NOMBRE" },
		{ key: "email", label: "CORREO" },
		{ key: "role", label: "ROL" },
	];

	const editableColumns = ["role"];
	const dropdownOptions = { role: ["admin", "user"] };

	const fetchUserData = async () => {
		try {
			const querySnapshot = await getDocs(collection(db, "users"));
			return querySnapshot.docs
				.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))
				.filter((user) => user.role === "admin" || user.role === "user");
		} catch (error) {
			console.error("Error fetching user data: ", error);
		}
	};

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

	function handleAgregarUsuario() {
		setLoading(true); // Start loading
		modal.onOpen(); // Open modal

		const fetchOtherUserData = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "users")); // Adjust the collection name if needed
				const nonUsers = querySnapshot.docs
					.map((doc) => ({
						id: doc.id, // Optional: Add document ID if needed
						...doc.data(),
					}))
					// Filter to include only users without a role
					.filter((user) => !user.role || user.role === "");

				setNonUsers(nonUsers);
				console.log(nonUsers);
			} catch (error) {
				console.error("Error fetching user data: ", error);
			}
		};

		fetchOtherUserData();

		setLoading(false); // End loading
	}

	async function handleGuardar() {
		try {
			console.log("seleccion", selectedUsers);
			for (const id of selectedUsers) {
				const userDoc = doc(db, "users", id); // Reference each document by ID
				await updateDoc(userDoc, { role: "user" });
			}

			// Refresh the user data after updating
			const updatedUsers = await fetchUserData();
			setUserData(updatedUsers);

			modal.onClose(); // Close modal after saving
		} catch (error) {
			console.error("Error updating user roles: ", error);
			setLoading(false); // Ensure loading is turned off in case of error
		}
	}

	const filteredNonUsers = nonUsers.map((user) => ({
		id: user.uuid,
		name: user.name || "N/A",
		email: user.email || "N/A",
		department: user.department || "N/A",
	}));

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
						onPress={handleAgregarUsuario}
					>
						Agregar usuarios
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
			<Modal
				isOpen={modal.isOpen}
				onClose={modal.onClose}
				onOpenChange={modal.onOpenChange}
				radius="lg"
				size="2xl"
				scrollBehavior="inside"
				classNames={{
					base: "bg-[#202020] border-[#41434A] border-2",
					backdrop: "",
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<Typography variant="h5" gutterBottom>
									Agregar usuarios
								</Typography>
							</ModalHeader>
							<ModalBody>
								<Box>
									{loading ? ( // Show skeleton if loading
										<>
											<div className="space-y-3">
												{" "}
												{/* This adds vertical spacing between items */}
												<Skeleton
													isLoaded={!loading}
													className="w-4/5 rounded-lg"
												>
													{" "}
													{/* 80% width */}
													<div className="bg-gray-300 h-6 w-full rounded"></div>
												</Skeleton>
												<Skeleton
													isLoaded={!loading}
													className="w-3/4 rounded-lg"
												>
													{" "}
													{/* 75% width */}
													<div className="bg-gray-300 h-6 w-full rounded"></div>
												</Skeleton>
												<Skeleton
													isLoaded={!loading}
													className="w-2/3 rounded-lg"
												>
													{" "}
													{/* 66.67% width */}
													<div className="bg-gray-300 h-6 w-full rounded"></div>
												</Skeleton>
												<Skeleton
													isLoaded={!loading}
													className="w-3/5 rounded-lg"
												>
													{" "}
													{/* 60% width */}
													<div className="bg-gray-300 h-6 w-full rounded"></div>
												</Skeleton>
												<Skeleton
													isLoaded={!loading}
													className="w-5/12 rounded-lg"
												>
													{" "}
													{/* 41.67% width */}
													<div className="bg-gray-300 h-6 w-full rounded"></div>
												</Skeleton>
												<Skeleton
													isLoaded={!loading}
													className="w-1/4 rounded-lg"
												>
													{" "}
													{/* 25% width */}
													<div className="bg-gray-300 h-6 w-full rounded"></div>
												</Skeleton>
												<Skeleton
													isLoaded={!loading}
													className="w-2/3 rounded-lg"
												>
													{" "}
													{/* 66.67% width */}
													<div className="bg-gray-300 h-6 w-full rounded"></div>
												</Skeleton>
												<Skeleton
													isLoaded={!loading}
													className="w-1/2 rounded-lg"
												>
													{" "}
													{/* 50% width */}
													<div className="bg-gray-300 h-6 w-full rounded"></div>
												</Skeleton>
												<Skeleton
													isLoaded={!loading}
													className="w-3/5 rounded-lg"
												>
													{" "}
													{/* 60% width */}
													<div className="bg-gray-300 h-6 w-full rounded"></div>
												</Skeleton>
											</div>
										</>
									) : (
										<div>
											<Table
												color="default"
												selectionMode="multiple"
												aria-label="Non users"
												isHeaderSticky
												classNames={{
													wrapper: "bg-[#2D2D2D]",
													th: "bg-[#404040] text-color-[#F6F6F6] font-semibold text-xs",
													td: "font-normal text-xs max-w-[180px]",
													base: "overflow-auto",
													table: "min-h-[120px] ",
												}}
												onSelectionChange={(keys) =>
													setSelectedUsers(Array.from(keys))
												}
											>
												<TableHeader>
													<TableColumn>NOMBRE</TableColumn>
													<TableColumn>CORREO</TableColumn>
													<TableColumn>DEPARTAMENTO</TableColumn>
												</TableHeader>
												<TableBody>
													{filteredNonUsers.map((user, index) => (
														<TableRow key={user.id}>
															<TableCell>{user.name}</TableCell>
															<TableCell>{user.email}</TableCell>
															<TableCell>{user.department}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									)}
								</Box>
							</ModalBody>

							<ModalFooter className="flex flex-row justify-end py-6">
								<Button className="bg-[#636363] w-1/3" onClick={handleGuardar}>
									Guardar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}

export default Accesos;
