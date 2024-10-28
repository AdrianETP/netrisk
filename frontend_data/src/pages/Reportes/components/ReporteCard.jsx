import { SvgIcon, Typography } from "@mui/material";
import "./ReporteCard.css";
import { Button } from "@nextui-org/button";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { jsPDF } from "jspdf";

function ReporteCard({ id, generatedDate, startDate, endDate, reportContent }) {
	// Function to handle PDF generation
	const handleDownloadPDF = () => {
		const doc = new jsPDF();

		// Set up the content of the PDF
		doc.setFontSize(16);
		doc.text(`Reporte #${id}`, 10, 10);
		doc.setFontSize(12);
		doc.text(`Generado: ${generatedDate}`, 10, 20);
		doc.text(`Período: ${startDate} - ${endDate}`, 10, 30);
		doc.text("Contenido del Reporte:", 10, 40);

		// Adding reportContent to the PDF
		const reportLines = doc.splitTextToSize(reportContent, 180);
		doc.text(reportLines, 10, 50);

		// Save the PDF
		doc.save(`Reporte_${id}.pdf`);
	};

	return (
		<div className="reporte-card-wrapper relative">
			{/* Ícono de eliminar posicionado en la esquina superior derecha */}
			<div className="absolute top-5 right-5">
				<DeleteRoundedIcon />
			</div>
			<div className="flex flex-row flex-wrap content-center items-center gap-4 pb-4">
				<SvgIcon fontSize="large">
					<svg
						width="40"
						height="40"
						viewBox="0 0 40 40"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clipPath="url(#clip0_134_30385)">
							<path
								d="M0.5 5.375C0.5 2.68613 2.68613 0.5 5.375 0.5H17.5625V10.25C17.5625 11.5982 18.6518 12.6875 20 12.6875H29.75V23.6562H13.9062C11.2174 23.6562 9.03125 25.8424 9.03125 28.5312V39.5H5.375C2.68613 39.5 0.5 37.3139 0.5 34.625V5.375ZM29.75 10.25H20V0.5L29.75 10.25ZM13.9062 27.3125H16.3438C18.6975 27.3125 20.6094 29.2244 20.6094 31.5781C20.6094 33.9318 18.6975 35.8438 16.3438 35.8438H15.125V38.2812C15.125 38.9516 14.5766 39.5 13.9062 39.5C13.2359 39.5 12.6875 38.9516 12.6875 38.2812V28.5312C12.6875 27.8609 13.2359 27.3125 13.9062 27.3125ZM16.3438 33.4062C17.3568 33.4062 18.1719 32.5912 18.1719 31.5781C18.1719 30.565 17.3568 29.75 16.3438 29.75H15.125V33.4062H16.3438ZM23.6562 27.3125H26.0938C28.1123 27.3125 29.75 28.9502 29.75 30.9688V35.8438C29.75 37.8623 28.1123 39.5 26.0938 39.5H23.6562C22.9859 39.5 22.4375 38.9516 22.4375 38.2812V28.5312C22.4375 27.8609 22.9859 27.3125 23.6562 27.3125ZM26.0938 37.0625C26.7641 37.0625 27.3125 36.5141 27.3125 35.8438V30.9688C27.3125 30.2984 26.7641 29.75 26.0938 29.75H24.875V37.0625H26.0938ZM32.1875 28.5312C32.1875 27.8609 32.7359 27.3125 33.4062 27.3125H37.0625C37.7328 27.3125 38.2812 27.8609 38.2812 28.5312C38.2812 29.2016 37.7328 29.75 37.0625 29.75H34.625V32.1875H37.0625C37.7328 32.1875 38.2812 32.7359 38.2812 33.4062C38.2812 34.0766 37.7328 34.625 37.0625 34.625H34.625V38.2812C34.625 38.9516 34.0766 39.5 33.4062 39.5C32.7359 39.5 32.1875 38.9516 32.1875 38.2812V28.5312Z"
								fill="#F8F8F8"
							/>
						</g>
						<defs>
							<clipPath id="clip0_134_30385">
								<rect
									width="39"
									height="39"
									fill="white"
									transform="translate(0.5 0.5)"
								/>
							</clipPath>
						</defs>
					</svg>
				</SvgIcon>
				<div className="flex flex-col">
					<Typography variant="h6" fontWeight="bold" fontSize="18px">
						Reporte #{id}
					</Typography>
					<Typography variant="subtitle" fontStyle="italic" fontSize="16px">
						Generado {generatedDate}
					</Typography>
				</div>
			</div>
			<Typography variant="body">
				Información del {startDate} al {endDate}.
			</Typography>
			<div className="flex justify-end mt-auto">
				<Button
					color="default"
					size="md"
					endContent={<DownloadRoundedIcon fontSize="medium" />}
					className="px-10 bg-[#636363]"
					onClick={handleDownloadPDF} // Trigger the PDF download
				>
					Descargar
				</Button>
			</div>
		</div>
	);
}

export default ReporteCard;
