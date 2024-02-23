import { useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { SimpleContainer, StepperComponent, Scaffold } from "./Scaffold";
import DicomViewer from "./DicomViewer";

const NotFound = () => {
	return <div>NotFound</div>;
};

function App() {
	useEffect(() => {
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
				<Scaffold>
					<SimpleContainer>
						<StepperComponent />
					</SimpleContainer>
				</Scaffold>
			),
		},

		{
			path: "/visualization",
			element: (
				<Scaffold>
					<DicomViewer />
				</Scaffold>
			),
		},

		{
			path: "*",
			element: <NotFound />,
		},
	]);
	return element;
}

export default App;
