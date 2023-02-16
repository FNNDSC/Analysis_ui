import React from "react";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneFileImageLoader from "cornerstone-file-image-loader";
import * as cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";
import CornerstoneViewport from "react-cornerstone-viewport";
import test1 from "./test/input.jpg";
import test2 from "./test/output.png";
import test3 from "./test/heatmaps.jpg";
import "./imagescanner.css";

cornerstoneFileImageLoader.external.cornerstone = cornerstone;

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.init();

async function fetchBlob(image) {
  const blobURL = await fetch(image)
    .then((response) => response.blob())
    .then((blob) => blob);

  return blobURL;
}

const ImageScanner = ({ count }) => {
  const [imageIds, setImageIds] = React.useState();
  const navigate = useNavigate();

  const toggleAnimation = React.useCallback(() => {
    const previewAnimation = [{ opacity: "0.0" }, { opacity: "1.0" }];

    const previewAnimationTiming = {
      duration: 100,
      iterations: 1,
    };
    document
      .querySelector(".cornerstone-canvas")
      ?.animate(previewAnimation, previewAnimationTiming);
  }, []);

  const setImageIdsState = async (url) => {
    const stack1 = cornerstoneFileImageLoader.fileManager.add(url);
    const imageId1 = await cornerstone
      .loadAndCacheImage(stack1)
      .then((image) => {
        return image.imageId;
      });
    setImageIds([imageId1]);
  };

  React.useEffect(() => {
    async function loadImages() {
      if (count === 0) {
        const url = await fetchBlob(test1);
        setImageIdsState(url);
      }

      if (count === 3) {
        const url = await fetchBlob(test3);
        setImageIdsState(url);
      }

      if (count === 5) {
        const url = await fetchBlob(test2);
        setImageIdsState(url);
      }
    }

    loadImages();
  }, [count, toggleAnimation]);

  const scan = count >= 2 && count <= 4;
  const viewImage = () => {
    navigate("/visualization");
  };
  return (
    <>
      <div id={`container`} className={scan ? "monitor" : ""}>
        <div className={scan ? "scan" : ""}></div>
        <div
          style={{ minWidth: "100%", height: "100%", flex: "1" }}
          className={scan ? "screen" : ""}
        >
          {imageIds && imageIds.length > 0 && (
            <CornerstoneViewport
              tools={["Length"]}
              activeTool={"Length"}
              imageIds={imageIds}
            />
          )}
        </div>
        {count === 5 && (
          <Button
            className="button"
            variant="contained"
            onClick={() => {
              viewImage();
            }}
          >
            View Side by Side
          </Button>
        )}
      </div>
    </>
  );
};

export default ImageScanner;
