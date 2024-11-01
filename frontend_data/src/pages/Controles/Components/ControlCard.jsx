import {
	Button,
	Select,
	Spacer,
	SelectItem,
	useDisclosure,
	Modal,
	ModalFooter,
	ModalBody,
	ModalHeader,
	ModalContent,
	Skeleton,
} from "@nextui-org/react";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import "./ControlCard.css";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { put, get, post } from "../../../ApiRequests.js";

const ControlCard = ({ nombre, code, description, initialState }) => {
	const [state, setState] = useState(initialState);
	const modal = useDisclosure();
	const [guia, setGuia] = useState("");
	const [guiaLineas, setGuiaLineas] = useState([]);
	const [loading, setLoading] = useState(false); // Changed to false initially

	const stateStyles = {
		Implementado: {
			icon: (
				<CheckCircleOutlineRoundedIcon fontSize="14px" htmlColor="#17C964" />
			),
		},
		"En proceso": {
			icon: <AccessTimeRoundedIcon fontSize="14px" htmlColor="#F5A524" />,
		},
		"En revisión": {
			icon: <VisibilityOutlinedIcon fontSize="14px" htmlColor="#006FEE" />,
		},
		"Sin implementar": {
			icon: <HighlightOffRoundedIcon fontSize="14px" htmlColor="#F31260" />,
		},
		Excluido: {
			icon: (
				<RemoveCircleOutlineRoundedIcon fontSize="14px" htmlColor="#E4E4E7" />
			),
		},
	};

	const handleStateChange = (event) => {
		const newState = event.target.value;
		setState(newState);

		put(
			`api/controles/${code}`,
			{ state: newState },
			() => {
				console.log("Estado actualizado correctamente!");
			},
			() => {
				console.error("Error al actualizar el estado");
			}
		);
	};

	const handleClick = async () => {
		setLoading(true); // Start loading
		modal.onOpen(); // Open modal
		await get(`api/controles/${code}/guia`)
			.then((result) => {
				setGuia(result);
			})
			.catch((error) => {
				console.error("Ocurrió un error:", error);
			});

		if (guia == "")
			await post(`api/controles/${code}/guia`, { nombre: nombre })
				.then((result) => {
					console.log(result);
					setGuia(result.guia);
				})
				.catch((error) => {
					console.error("Ocurrió un error:", error);
				});
		setLoading(false); // End loading
	};

	return (
		<>
			<div className="control-card">
				<div className="control-card-title">
					<ShieldOutlinedIcon fontSize="large" />
					<div className="flex-col">
						<Typography
							variant="h5"
							component="div"
							fontSize={"18px"}
							fontWeight={"bold"}
						>
							{nombre}
						</Typography>
						<Typography
							variant="subtitle1"
							color="textSecondary"
							fontSize={"16px"}
							fontWeight={"normal"}
						>
							{code}
						</Typography>
					</div>
				</div>
				<Spacer y={1} />
				<Typography variant="body1" fontSize={"16px"} fontWeight={"normal"}>
					{description}
				</Typography>
				<Spacer y={4} />
				<div className="control-card-buttons">
					<Select
						size="md"
						value={state}
						onChange={handleStateChange}
						placeholder={state || "Estado"}
						startContent={stateStyles[state]?.icon || null}
					>
						{Object.keys(stateStyles).map((key) => (
							<SelectItem key={key} value={key}>
								{key}
							</SelectItem>
						))}
					</Select>
					<Button
						fullWidth
						endContent={<ArrowForwardIosRoundedIcon fontSize="sm" />}
						className="bg-[#636363]"
						onClick={handleClick}
					>
						Implementación
					</Button>
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
									Guía de implementación: {code} - {nombre}
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
										guia.split("\n").map((line, index) => (
											<p
												key={index}
												style={{
													margin: "0",
													fontSize: "1rem",
													lineHeight: "1.5",
												}}
											>
												{line}
											</p>
										))
									)}
								</Box>
							</ModalBody>

							<ModalFooter className="flex flex-row justify-between gap-28 py-6">
								<Select
									size="md"
									className="w-1/3"
									value={state}
									onChange={handleStateChange}
									placeholder={state || "Estado"}
									startContent={stateStyles[state]?.icon || null}
								>
									{Object.keys(stateStyles).map((key) => (
										<SelectItem key={key} value={key}>
											{key}
										</SelectItem>
									))}
								</Select>
								<Button className="bg-[#636363] w-1/3" onClick={onClose}>
									Cerrar
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default ControlCard;
