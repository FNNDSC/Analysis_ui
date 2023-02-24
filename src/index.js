import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useRoutes, Navigate } from "react-router-dom";
import { App, SimpleContainer, StepperComponent } from "./App";
import DicomViewer from "./DicomViewer";
import "./index.css";

const NotFound = () => {
  return <div>NotFound</div>;
};

const Routes = () => {
  React.useEffect(() => {
    document.title = "ChRIS LegMeas";
  }, []);

  const element = useRoutes([
    {
      path: "/",
      element: <Navigate to="/LegMeas" />,
    },

    {
      path: "/LegMeas",
      element: (
        <App
          children={
            <SimpleContainer>
              <StepperComponent />
            </SimpleContainer>
          }
        />
      ),
    },

    {
      path: "/visualization",
      element: <App children={<DicomViewer />} />,
    },

    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return element;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
);
