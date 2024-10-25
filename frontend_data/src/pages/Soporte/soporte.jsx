import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";
import "../Controles/controles.css";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Button } from "@nextui-org/react";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import ImportContactsRoundedIcon from "@mui/icons-material/ImportContactsRounded";

function Soporte() {
	const [inputValue, setInputValue] = useState("");
	const openEmailPrompt = () => {
		const email = "support@netrisk.com"; // Replace with the recipient's email
		const subject = "Ticket de soporte al cliente"; // Subject of the email
		const body = ""; // Body content

		const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
			subject
		)}&body=${encodeURIComponent(body)}`;

		window.location.href = mailtoLink; // Opens the default email client
	};

	const faqs = [
		{
			question: "¿Qué es NetRisk y cómo funciona?",
			answer:
				"NetRisk es una herramienta de análisis de riesgos cibernéticos diseñada específicamente para redes de instituciones educativas. Utiliza técnicas de escaneo de red, inteligencia artificial y análisis de vulnerabilidades para identificar y priorizar riesgos, recomendando controles de seguridad basados en el marco NIST 800-53.",
		},
		{
			question:
				"¿Qué tipo de instituciones educativas pueden utilizar NetRisk?",
			answer:
				"NetRisk es adaptable a todo tipo de instituciones educativas, desde escuelas pequeñas hasta universidades con múltiples campus. La herramienta se puede personalizar según las necesidades específicas de la red de cada institución.",
		},
		{
			question:
				"¿NetRisk requiere algún conocimiento técnico para ser utilizado?",
			answer:
				"No es necesario tener conocimientos técnicos avanzados para utilizar NetRisk. La herramienta está diseñada con una interfaz intuitiva que permite a los usuarios no técnicos interpretar resultados y tomar decisiones informadas. Además, proporciona recomendaciones claras y detalladas.",
		},
		{
			question:
				"¿Cómo asegura NetRisk la privacidad y la seguridad de los datos analizados?",
			answer:
				"NetRisk sigue estrictos estándares de seguridad y cumple con las normativas de ciberseguridad aplicables. Los datos se procesan y almacenan de forma segura utilizando cifrado y prácticas de seguridad recomendadas para proteger la información sensible de las instituciones educativas.",
		},
		{
			question:
				"¿Qué marcos de referencia utiliza NetRisk para evaluar los riesgos?",
			answer:
				"NetRisk se basa en el marco NIST 800-53 para la evaluación de riesgos y recomendaciones de seguridad. Además, se apoya en bases de datos como MITRE ATT&CK para proporcionar información detallada sobre las vulnerabilidades detectadas y sus posibles impactos.",
		},
		{
			question:
				"¿Cuánto tiempo toma realizar un análisis de red completo con NetRisk?",
			answer:
				"El tiempo de análisis puede variar dependiendo del tamaño de la red y la cantidad de dispositivos conectados. En general, NetRisk está optimizado para realizar un análisis completo en cuestión de minutos a unas pocas horas, proporcionando resultados rápidos y detallados para la toma de decisiones oportuna.",
		},
	];

	// Filter the FAQs based on the input value
	const filteredFaqs = faqs.filter((faq) =>
		faq.question.toLowerCase().includes(inputValue.toLowerCase())
	);

	return (
		<div className="controles-container-full pb-6">
			<div className="flex flex-row p-6 gap-4">
				<Button
					onClick={openEmailPrompt}
					endContent={<EmailRoundedIcon />}
					className="px-16"
				>
					Contáctanos
				</Button>
				<a
					href="https://docs.google.com/document/d/1_GnvNQIXfumduyPSykm82QUAD0GqPy4loqWOj_DV7KI/edit?usp=sharing"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button endContent={<ImportContactsRoundedIcon />} className="px-14">
						Manual de usuario
					</Button>
				</a>
			</div>
			<div className="recomendacion-controles-container">
				<div className="recomendacion-controles-titulo">
					<QuestionAnswerRoundedIcon fontSize="large" />
					<Typography
						variant="h6"
						sx={{
							fontSize: "20px",
							fontWeight: "normal",
							width: "30vw",
						}}
					>
						Preguntas frecuentes
					</Typography>
				</div>
				<Autocomplete
					disablePortal
					options={faqs}
					getOptionLabel={(option) => option.question}
					onInputChange={(event, newInputValue) => {
						setInputValue(newInputValue);
					}}
					sx={{
						width: 300,
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							placeholder="Búsqueda"
							InputProps={{
								...params.InputProps,
								startAdornment: (
									<InputAdornment position="start">
										<SearchRoundedIcon />
									</InputAdornment>
								),
								style: { borderRadius: 12 },
							}}
							sx={{
								height: "45px",
								"& .MuiOutlinedInput-root": {
									height: "100%",
									"& fieldset": {
										borderWidth: 2,
										borderColor: "#A1A1AA",
									},
									"&:hover fieldset": {
										borderColor: "#f6f6f6",
									},
									"&.Mui-focused fieldset": {
										borderColor: "#f6f6f6",
									},
								},
								"& .MuiInputBase-input": {
									padding: "12px",
								},
							}}
						/>
					)}
				/>
			</div>
			<div className="px-6 ">
				<Accordion
					selectionMode="multiple"
					fullWidth
					itemClasses={{
						base: "py-0 w-full",
						title: "font-semibold text-medium w-full",
						trigger:
							"px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
						indicator: "text-large",
						content: "text-small font-regular ",
					}}
				>
					{filteredFaqs.map((faq, index) => (
						<AccordionItem
							key={index}
							aria-label={`Accordion ${index + 1}`}
							title={faq.question}
						>
							{faq.answer}
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}

export default Soporte;
