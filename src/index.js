import React from "react";
import { Navigate } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App, SimpleContainer, StepperComponent } from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, useRoutes } from "react-router-dom";
import DicomViewer from "./DicomViewer";

const NotFound = () => {
  return <div>NotFound</div>;
};

const Routes = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Navigate to="/LLDUI" />,
    },

    {
      path: "/LLDUI",
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
