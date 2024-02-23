import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import {
	CssBaseline,
	Stepper,
	StepLabel,
	Step,
	Toolbar,
	Box,
	IconButton,
	Typography,
	Alert,
	AppBar,
	Link,
	Container,
	createTheme,
	ThemeProvider,
	Snackbar,
	Tooltip,
} from "@mui/material";
import { Menu, Fullscreen, Info } from "@mui/icons-material/";
import ImageScanner from "./ImageScanner";
import Footer from "./Footer";

const theme = createTheme({
	palette: {
		mode: "dark",
	},
});

export function Scaffold({ children }) {
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<BasicMenu />

				{children}
				<Footer />
			</ThemeProvider>
		</div>
	);
}

const InfoComponent = () => {
	const location = useLocation();

	let title = "";
	if (location.pathname === "/LegMeas") {
		title =
			"LegMeas uses ChRIS to automatically determine leg lengths from a CT image. Each of the progress stops represents stations in the processing. Since ChRIS is independent from a clinical service, an image to process must first be pulled into ChRIS for analysis. Once finished, ChRIS will push the resultant image back to the source PACS where it will appear in the Study as a new Series. To see the detailed view of the processing within ChRIS, please hit the LOGIN button.\n\nOnce an analysis is complete, hit the full screen icon [] for an immersive view.";
	} else if (location.pathname === "/visualization") {
		title =
			"This immersive view shows the original and processed images size by size. You can draw measurement markers on the image using the mouse.\n\nTo remove a marker, mouse over so that it turns green. Then, simply drag and drop the marker in the background black bars on either side of the images to trash it.";
	}

	return (
		<Tooltip title={title} placement="bottom">
			<IconButton
				size="large"
				edge="start"
				color="inherit"
				aria-label="menu"
				sx={{ mr: 2 }}
			>
				<Info />
			</IconButton>
		</Tooltip>
	);
};

function BasicMenu() {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
					>
						<Menu />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Automatic Leg Length Discrepancy with ChRIS
					</Typography>

					<InfoComponent />

					<Link
						target="_blank"
						rel="noopener noreferrer"
						href="https://app.chrisproject.org/login"
						underline="none"
					>
						ChRIS LOGIN
					</Link>
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export function SimpleContainer({ children }) {
	return (
		<React.Fragment>
			<Container maxWidth="lg">
				<Box sx={{ height: "100vh" }}>{children}</Box>
			</Container>
		</React.Fragment>
	);
}

const steps = [
	"Retrieving from PACS",
	"Uploading to ChRIS",
	"Finding Landmarks with AI",
	"Measuring Lengths",
	"Pushing to PACS",
];

const transitionTimings = [0.5, 0.75, 1.25, 4.25, 3.75, 1.75, 4.75];

function useInterval(callback, delay) {
	const savedCallback = useRef();
	useEffect(() => {
		savedCallback.current = callback;
	});

	useEffect(() => {
		function tick() {
			savedCallback.current();
		}

		const id = setInterval(tick, delay);
		return () => clearInterval(id);
	}, [delay]);
}

export function StepperComponent() {
	const navigate = useNavigate();

	const [count, setCount] = useState(0);
	const [processingCount, setProcessingCount] = useState(0);
	const [playing, setIsPlaying] = useState(false);
	const [snackbar, setSnackBar] = useState(false);

	const timing = transitionTimings.includes(count) ? 1000 : 3000;

	React.useEffect(() => {
		window.addEventListener("keydown", (event) => {
			if (event.code === "Space") {
				event.preventDefault();
				setIsPlaying((state) => !state);
				setSnackBar((state) => !state);
			}
		});
	}, []);

	useInterval(
		() => {
			if (!playing && count < steps.length) {
				setCount(count + 0.25);
			}
		},
		!playing ? timing : null,
	);

	useInterval(() => {
		if (count === steps.length && processingCount < 7) {
			setProcessingCount(processingCount + 1);
		}
	}, 100);

	if (count >= 0.5 && count <= 0.75) {
		const pacsPush = document.querySelector(".image-load");

		if (pacsPush) {
			const animation = pacsPush.animate(
				{
					transform: "translateY(820px)",
				},
				{
					duration: 1000,
					fill: "forwards",
					iteration: "1",
				},
			);
			animation.commitStyles();
		}
	}

	if (count === 1.75 || count === 4.75) {
		const imageLoad = document.querySelector(".image-push");
		if (imageLoad) {
			const animation = imageLoad.animate(
				{
					transform: "translateY(0px)",
				},
				{
					duration: 1000,
					fill: "forwards",
					iteration: "1",
				},
			);
			animation.commitStyles();
		}
	}

	const viewImage = () => {
		navigate("/visualization");
	};

	const scanAi = count >= 2 && count <= 3;
	const scanMeasurements = count >= 3 && count <= 3.75;

	const imageLoad = count >= 0 && count <= 0.75;
	const imagePush =
		(count >= 1 && count <= 1.75) || (count >= 4 && count <= 4.75);
	let activeStep = fetchActiveStep(count);

	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				open={snackbar}
			>
				<Alert severity="info">
					{playing ? "Polling Stopped" : "Polling Resumed"}
				</Alert>
			</Snackbar>

			<Box sx={{ width: "100%", marginTop: "2rem" }}>
				<Stepper activeStep={activeStep} alternativeLabel>
					{steps.map((label, index) => (
						<Step
							onClick={() => {
								setCount(index);
							}}
							key={label}
						>
							<StepLabel
								className={
									scanMeasurements && activeStep === index
										? "scan-measure-label"
										: scanAi && activeStep === index
										  ? "scan-ai-label"
										  : imageLoad && activeStep === index
											  ? "image-load-label"
											  : imagePush && activeStep === index
												  ? "image-push-label"
												  : ""
								}
							>
								{label}
							</StepLabel>
						</Step>
					))}
				</Stepper>
			</Box>

			<Box
				sx={{
					position: "relative",
					height: "100%",
					width: "100%",
					marginTop: "3rem",
				}}
			>
				{(scanMeasurements || scanAi) && (
					<div
						className={`${scanMeasurements || scanAi ? "scan" : ""} ${
							scanAi ? "scan-ai-shadow" : ""
						} ${scanMeasurements ? "scan-measure-shadow" : ""}`}
					/>
				)}

				{imageLoad && <div className="image-load" />}
				{imagePush && <div className="image-push" />}

				<div className="screen">
					{count >= 0.75 && <ImageScanner count={count} />}
					{count >= 4 && (
						<IconButton className="button" onClick={() => viewImage()}>
							<Fullscreen />
						</IconButton>
					)}
				</div>
			</Box>
		</>
	);
}

function fetchActiveStep(count) {
	if (count >= 0 && count < 1) {
		return 0;
	}
	if (count >= 1 && count < 2) {
		return 1;
	}
	if (count >= 2 && count < 3) {
		return 2;
	}
	if (count >= 3 && count < 4) {
		return 3;
	}
	if (count >= 4 && count < 5) {
		return 4;
	}
	if (count >= 5) return 5;
}
