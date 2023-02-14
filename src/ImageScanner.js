import React from "react";

import * as dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";
import CornerstoneViewport from "react-cornerstone-viewport";
import test1 from "./test/input.dcm";
import test2 from "./test/output.dcm";
import "./imagescanner.css";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.configure({
  beforeSend: function (xhr) {
    // Add custom headers here (e.g. auth tokens)
    //xhr.setRequestHeader('x-auth-token', 'my auth token');
  },
});
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.init();
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

const stack1 = "wadouri:" + test1;
const stack2 = "wadouri:" + test2;

const ImageScanner = ({ count }) => {
  const [imageIds, setImageIds] = React.useState();

  const toggleAnimation = React.useCallback(() => {
    const previewAnimation = [{ opacity: "0.0" }, { opacity: "1.0" }];

    const previewAnimationTiming = {
      duration: 2000,
      iterations: 1,
    };
    document
      .querySelector(".cornerstone-canvas")
      ?.animate(previewAnimation, previewAnimationTiming);
  }, []);

  React.useEffect(() => {
    async function loadImages() {
      if (count === 0) {
       
        const imageId1 = await cornerstone
          .loadAndCacheImage(stack1)
          .then((image) => image.imageId);
        setImageIds([imageId1]);
        toggleAnimation();
      }

      if (count === 5) {
        const imageId2 = await cornerstone
          .loadAndCacheImage(stack2)
          .then((image) => image.imageId);
        setImageIds([imageId2]);
        toggleAnimation();
      }
    }

    loadImages();
  }, [count, toggleAnimation]);

  const scan = count >= 2 && count <= 4;

  return (
    <>
      <div id={scan ? "monitor" : "container"}>
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
      </div>
    </>
  );
};

export default ImageScanner;
