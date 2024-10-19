import { Button, Select, Spacer, SelectItem } from "@nextui-org/react";
import { Typography } from "@mui/material";
import { useState } from "react";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import "./ControlCard.css";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const ControlCard = ({ nombre, code, description, initialState }) => {
	const [state, setState] = useState(initialState);

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
		"Excluido": {
			icon: (
				<RemoveCircleOutlineRoundedIcon fontSize="14px" htmlColor="#E4E4E7" />
			),
		},
	};

	const handleStateChange = (event) => {
		setState(event.target.value);
	};

	return (
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
				>
					Implementación
				</Button>
			</div>
		</div>
	);
};

export default ControlCard;
