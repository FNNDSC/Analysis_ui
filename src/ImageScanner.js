import React from "react";

import * as dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";
import CornerstoneViewport from "react-cornerstone-viewport";
import test1 from "./test/input.dcm";
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

const ImageScanner = ({ count }) => {
  const [imageId, setImageId] = React.useState();

  React.useEffect(() => {
    async function loadImages() {
      const imageId1 = await cornerstone
        .loadAndCacheImage(stack1)
        .then((image) => image.imageId);
      setImageId([imageId1]);
    }

    loadImages();
  }, []);

  return (
    <>
      <div id={count >= 2 ? "monitor" : "container"}>
        <div className={count >= 2 ? "scan" : ""}></div>
        <div
          style={{ minWidth: "100%", height: "100%", flex: "1" }}
          className={count > -2 ? "screen" : ""}
        >
          {imageId && imageId.length > 0 && (
            <CornerstoneViewport activeTool={"Invert"} imageIds={imageId} />
          )}
        </div>
      </div>
    </>
  );
};

export default ImageScanner;
