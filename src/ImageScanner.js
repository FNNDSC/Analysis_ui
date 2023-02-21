import React from "react";
import input from "./test/input.jpg";
import output from "./test/output.jpg";
import heatmaps from "./test/heatmaps.jpg";
import { Fade } from "@mui/material";

const ImageScanner = ({ count }) => {
  const [src, setSrc] = React.useState();

  React.useEffect(() => {
    async function loadImages() {
      if (count === 1) {
        setSrc(input);
      }

      if (count === 3) {
        setSrc(heatmaps);
      }

      if (count === 4) {
        setSrc(output);
      }
    }

    loadImages();
  }, [count]);

  return (
    <div id="container">
      {
        <Fade in={true}>
          <img alt="leg length images" src={src} />
        </Fade>
      }
    </div>
  );
};

export default ImageScanner;
