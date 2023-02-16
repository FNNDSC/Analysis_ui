import React from "react";
import input from "./test/input.jpg";
import output from "./test/output.jpg";
import heatmaps from "./test/heatmaps.jpg";
import "./imagescanner.css";

const ImageScanner = ({ count }) => {
  const [src, setSrc] = React.useState();

  const toggleAnimation = React.useCallback(() => {
    const previewAnimation = [{ opacity: "0.0" }, { opacity: "1.0" }];

    const previewAnimationTiming = {
      duration: 100,
      iterations: 1,
    };
    document
      .querySelector(".img-animate")
      ?.animate(previewAnimation, previewAnimationTiming);
  }, []);

  React.useEffect(() => {
    async function loadImages() {
      if (count === 0) {
        setSrc(input);
        toggleAnimation();
      }

      if (count === 3) {
        setSrc(heatmaps);
        toggleAnimation();
      }

      if (count === 5) {
        setSrc(output);
      }
    }

    loadImages();
  }, [count, toggleAnimation]);

  return (
    <div id="container">
      {<img alt="leg length images" className="img-animate" src={src} />}
    </div>
  );
};

export default ImageScanner;
