import React from "react";
import input from "./test/input.jpg";
import output from "./test/output.jpg";
import heatmaps from "./test/heatmaps.jpg";


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

  const className =
    count === 1
      ? "img-animate"
      : count === 3
      ? "img-animateheat"
      : count >= 4
      ? "img-animateoutput img-fadeOut"
      : "";

  return (
    <div id="container">
      {<img alt="leg length images" className={className} src={src} />}
    </div>
  );
};

export default ImageScanner;
