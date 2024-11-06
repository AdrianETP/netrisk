import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
} from "@nextui-org/react";
import { Typography } from "@mui/material";

const NetScoreModal = ({ isVisible, onClose }) => {

	return (
		<Modal
			isOpen={isVisible}
			onClose={onClose}
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
						<ModalHeader className="flex flex-col gap-1 pb-0">
							Cálculo del NetScore
						</ModalHeader>
						<ModalBody>
							<Typography variant="h6" sx={{ color: "#bdbdbd" }}>
								¿Cómo se calcula el NetScore?
							</Typography>
							<Typography
								variant="body1"
								sx={{ color: "#bdbdbd", marginTop: "8px" }}
							>
								El NetScore es una métrica que evalúa el estado de la
								organización en términos de ciberseguridad, y se calcula
								utilizando las siguientes variables:
							</Typography>

							<Typography
								variant="body1"
								sx={{ color: "#bdbdbd", marginTop: "16px" }}
							>
								<strong>Vulnerabilidades Técnicas: </strong>
								<br></br>
								Se consideran las vulnerabilidades encontradas en la auditoría
								que tienen un impacto en la ciberseguridad. Cada vulnerabilidad
								se clasifica en uno de los siguientes niveles de impacto:
								<br></br>
								<br></br>
								<ul>
									<li>Crítico: -10 puntos</li>
									<li>Alto: -7 puntos</li>
									<li>Medio: -3 puntos</li>
									<li>Bajo: -1 punto</li>
								</ul>
								<br></br>
								El puntaje total de vulnerabilidades técnicas (vt_score) es la
								suma de los puntos de cada vulnerabilidad.
							</Typography>

							<Typography
								variant="body1"
								sx={{ color: "#bdbdbd", marginTop: "16px" }}
							>
								<strong>Vulnerabilidades Organizacionales: </strong>
								<br></br>
								Similar a las vulnerabilidades técnicas, se evalúan las
								vulnerabilidades organizacionales. Se aplica la misma escala de
								impacto que se utiliza para las vulnerabilidades técnicas,
								calculando el puntaje total de vulnerabilidades organizacionales
								(vo_score) de la misma manera.
							</Typography>

							<Typography
								variant="body1"
								sx={{ color: "#bdbdbd", marginTop: "16px" }}
							>
								<strong>Controles Implementados: </strong>
								<br></br>
								Se contabilizan los controles de seguridad que se han
								implementado en la organización. Cada control implementado suma
								10 puntos al puntaje de ciberseguridad, calculando el puntaje
								total de controles implementados (ci_score).
							</Typography>

							<Typography
								variant="body1"
								sx={{ color: "#bdbdbd", marginTop: "16px" }}
							>
								<strong>Cobertura de Roles: </strong>
								<br></br>
								Se evalúa el cumplimiento de los roles definidos en el marco
								NIST 800-53. Se calcula el porcentaje de roles cumplidos sobre
								el total de roles definidos (cr_score), multiplicando este
								porcentaje por 100 para obtener una escala de 0 a 100.
							</Typography>

							<Typography
								variant="body1"
								sx={{ color: "#bdbdbd", marginTop: "16px" }}
							>
								<strong>Cálculo Final del NetScore:</strong>
								<br></br>
								<br></br>
								El NetScore se calcula utilizando la siguiente fórmula:
								<br></br>
								<br></br>
								<Typography
									variant="button"
									sx={{
										color: "#e0e0e0",
										fontWeight: "bold",
										marginTop: "8px",
									}}
								>
									NetScore = 100 + vt_score + vo_score + (ci_score × 0.4) +
									(cr_score × 0.2)
								</Typography>
								<br></br>
								<br></br>
								El resultado se limita a un rango entre 0 y 100, asegurando que
								el NetScore no exceda estos límites.
							</Typography>

							<Typography
								variant="body1"
								sx={{ color: "#bdbdbd", marginTop: "16px" }}
							>
								<strong>Interpretación del NetScore:</strong>
								<br></br>
								<br></br>
								<ul>
									<li>
										0 - 40: Alta vulnerabilidad y riesgo en ciberseguridad. Se
										recomienda acciones correctivas inmediatas.
									</li>
									<li>
										41 - 70: Vulnerabilidades moderadas. Se requieren mejoras en
										la seguridad.
									</li>
									<li>
										71 - 100: Buen estado de ciberseguridad. La organización
										está en camino correcto, pero siempre debe haber mejoras
										continuas.
									</li>
								</ul>
							</Typography>
							<br></br>
							<br></br>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default NetScoreModal;
