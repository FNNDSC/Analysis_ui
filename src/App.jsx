import { useEffect } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { SimpleContainer, StepperComponent, Scaffold } from "./Scaffold";
import DicomViewer from "./DicomViewer";
import useSetDocumentTitle from './useSetDocumentTitle'

const NotFound = () => {
	return <div>NotFound</div>;
};

function App() {
	
	useSetDocumentTitle();
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
