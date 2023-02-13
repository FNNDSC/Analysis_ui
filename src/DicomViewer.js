import React, { useRef } from "react";
import * as dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneMath from "cornerstone-math";
import Hammer from "hammerjs";
import CornerstoneViewport from "react-cornerstone-viewport";
import test1 from "./test/input.dcm";
import test2 from "./test/output.dcm";

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

const getInitialState = () => {
  return {
    activeViewportIndex: 0,
    viewports: [0, 1],
    tools: [
      // Mouse
      {
        name: "Wwwc",
        mode: "active",
        modeOptions: { mouseButtonMask: 1 },
      },
      {
        name: "Zoom",
        mode: "active",
        modeOptions: { mouseButtonMask: 2 },
      },
      {
        name: "Pan",
        mode: "active",
        modeOptions: { mouseButtonMask: 4 },
      },
      "Length",
      "Angle",
      "Bidirectional",
      "FreehandRoi",
      "Eraser",
      // Scroll
      { name: "StackScrollMouseWheel", mode: "active" },
      // Touch
      { name: "PanMultiTouch", mode: "active" },
      { name: "ZoomTouchPinch", mode: "active" },
      { name: "StackScrollMultiTouch", mode: "active" },
    ],
    imageIds: [],
    // FORM
    activeTool: "Wwwc",
    imageIdIndex: 0,
    isPlaying: false,
    frameRate: 22,
  };
};

const DicomViewer = () => {
  const divRef = useRef();
  const [dicomState, setDicomState] = React.useState(getInitialState());
  const { viewports, tools, imageIds, imageIdIndex, activeViewportIndex } =
    dicomState;

  React.useEffect(() => {
    async function loadImages() {
      const imageId1 = await cornerstone
        .loadAndCacheImage(stack1)
        .then((image) => image.imageId);

      const imageId2 = await cornerstone
        .loadAndCacheImage(stack2)
        .then((image) => image.imageId);

      setDicomState((state) => {
        return {
          ...state,
          imageIds: [[imageId1], [imageId2]],
        };
      });
    }

    loadImages();
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <div
        ref={divRef}
        style={{ display: "flex", flexWrap: "wrap", height: "100%" }}
      >
        {imageIds.length > 0 &&
          viewports.map((viewport, index) => {
            const className = activeViewportIndex === viewport ? "active" : "";
            return (
              <div
                id={`viewport-${index}`}
                key={index}
                className={className}
                style={{ minWidth: "50%", height: "100%", flex: "1" }}
              >
                <CornerstoneViewport
                  activeViewportIndex={activeViewportIndex}
                  activeTool={"Length"}
                  key={index}
                  tools={tools}
                  imageIds={imageIds[viewport]}
                  imageIdIndex={imageIdIndex}
                  setViewportActive={() => {
                    setDicomState({
                      ...dicomState,
                      activeViewportIndex: viewport,
                    });
                  }}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default DicomViewer;
