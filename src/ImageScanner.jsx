import { Fade } from "@mui/material";
import React from "react";

const ImageScanner = ({ count }) => {
	const [src, setSrc] = React.useState();

	React.useEffect(() => {
		async function loadImages() {
			if (count >= 0.75 && count < 2.75) {
				const url = new URL("./assets/input.jpg", import.meta.url).href;
				setSrc(url);
			}

			if (count >= 2.75 && count < 4) {
				const url = new URL("./assets/heatmaps.jpg", import.meta.url).href;
				setSrc(url);
			}

			if (count >= 4) {
				const url = new URL("./assets/output.jpg", import.meta.url).href;
				setSrc(url);
			}
		}

		loadImages();
	}, [count]);

	return (
		<div id="container">
			<Fade in={true}>
				<img alt="leg length images" src={src} />
			</Fade>
		</div>
	);
};

export default ImageScanner;
