import React from "react";
import { IconButton } from "@mui/material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneMath from "cornerstone-math";
import CornerstoneViewport from "react-cornerstone-viewport";
import Hammer from "hammerjs";
import test1 from "./test/input.dcm";
import test2 from "./test/output.dcm";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
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
  const [element, setEnabledElement] = React.useState([]);
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
    <div style={{ height: "90vh" }}>
      <div style={{ display: "flex", flexWrap: "wrap", height: "100%" }}>
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
                <IconButton
                  onClick={async () => {
                    if (element.length > 0) {
                      const resetElement = element[index];
                      cornerstoneTools.clearToolState(
                        resetElement.element,
                        "Length"
                      );
                      cornerstone.reset(resetElement.element);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    class="bi bi-eraser"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
                  </svg>
                </IconButton>
                <CornerstoneViewport
                  onElementEnabled={(elementEnabledEvt) => {
                    console.log(elementEnabledEvt);
                    const cornerstoneElement = elementEnabledEvt.detail;
                    const newElement = element;
                    newElement[index] = cornerstoneElement;
                    setEnabledElement(newElement);
                  }}
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
