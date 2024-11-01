import { SvgIcon, Typography } from "@mui/material";
import "./ReporteCard.css";
import { Button } from "@nextui-org/button";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { jsPDF } from "jspdf";

function ReporteCard({ id, generatedDate, startDate, endDate, reportContent }) {
	// Function to handle PDF generation
	const handleDownloadPDF = async () => {
		const doc = new jsPDF();
		const pageHeight = doc.internal.pageSize.height;
		const pageWidth = doc.internal.pageSize.width;
		let yPosition = 50;
		let currentPage = 1;
		const totalPages = Math.ceil(reportContent.length / 180); // Estimate total pages for numbering

		// Load logo image
		const logo =
			"data:image/jpeg;base64,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"; // replace with actual base64 string of logo

		// Function to add header and page number footer
		const addPageElements = (pageNum) => {
			// Add black rectangle
			doc.setFillColor(0, 0, 0); // RGB for black
			doc.rect(0, 0, pageWidth, 36, "F"); // Full-width black rectangle at the top

			doc.setTextColor(255, 255, 255); // Set text color to white

			// Define scaling factor for the image size
			const scaleFactor = 0.8; // Adjust this factor to make the image bigger
			const logoWidth = 39.2 * scaleFactor;
			const logoHeight = 17.0 * scaleFactor;

			// Header with Logo
			doc.addImage(
				logo,
				"PNG",
				pageWidth - logoWidth - 10,
				10,
				logoWidth,
				logoHeight
			);
			doc.setFontSize(20);
			doc.setFont("Helvetica", "bold");
			doc.text(`Reporte #${id}`, 10, 15);

			doc.setFontSize(14);
			doc.setFont("Helvetica", "normal");
			doc.text(`Período: ${startDate} - ${endDate}`, 10, 25);

			// Divider line under header
			doc.setDrawColor(255, 255, 255); // White color for the line
			doc.setLineWidth(0.2);
			doc.line(10, 30, pageWidth - 10, 30); // Line below header

			// Page Number Footer
			doc.setTextColor(0, 0, 0); // Reset text color to black for content
			doc.setFontSize(12);
			doc.text(`Página ${pageNum}`, pageWidth - 20, pageHeight - 10, {
				align: "right",
			});
		};

		// Add initial page elements

		addPageElements(currentPage);
		doc.setFontSize(12);
		// Bold text processing
		const parseBoldText = (line) => {
			const parts = line.split(/(\*\*[^*]+\*\*)/); // Split by **bold** pattern
			let x = 10;
			parts.forEach((part) => {
				if (part.startsWith("**") && part.endsWith("**")) {
					doc.setFont(undefined, "bold");
					doc.text(part.slice(2, -2), x, yPosition); // Remove ** and add bold text
				} else {
					doc.setFont(undefined, "normal");
					doc.text(part, x, yPosition); // Normal text
				}
				x += doc.getTextWidth(part); // Adjust x for next part
			});
			yPosition += 6; // Move to next line
		};

		doc.setFontSize(12);
		var counter = 0;
		// Split and add content line by line with bold parsing
		const reportLines = doc.splitTextToSize(reportContent, 180);
		reportLines.forEach((line) => {
			// Check if we need a new page
			if (counter == 0) {
				doc.setFontSize(16);
				counter = 1;
			} else {
				doc.setFontSize(12);
			}
			if (yPosition + 20 > pageHeight) {
				doc.addPage();
				doc.setFontSize(12);
				currentPage++;
				addPageElements(currentPage);
				yPosition = 50; // Reset y position for new page
			}
			parseBoldText(line);
		});

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
