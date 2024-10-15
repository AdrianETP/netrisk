import React from "react";
import "./ProgressCircle.css";

function ProgressCircle({
	progressValue = 0, // The actual progress value (0-100)
	customColor = "#0DD4CE", // Color of the progress bar
	size = 200, // Diameter of the circle
	strokeWidth = 10, // Thickness of the circle
	displayValue = "", // Value to display inside the circle
	label = "Completed", // Text label to show under the value
}) {
	// Calculating the radius and circumference of the circle
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (progressValue / 100) * circumference;

	return (
		<div className="progress-circle" style={{ width: size, height: size }}>
			<svg className="pg-svg" width={size} height={size}>
				{/* Background circle with dynamic stroke width */}
				<circle
					className="progress-background"
					cx={size / 2}
					cy={size / 2}
					r={radius}
					strokeWidth={strokeWidth}
				/>
				{/* Progress circle with dynamic stroke width and color */}
				<circle
					className="progress-bar"
					cx={size / 2}
					cy={size / 2}
					r={radius}
					strokeWidth={strokeWidth}
					stroke={customColor}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
				/>
			</svg>
			<div className="progress-label">
				<div className="progress-text">{label}</div>
				<div className="progress-value">{displayValue}</div>
			</div>
		</div>
	);
}

export default ProgressCircle;
