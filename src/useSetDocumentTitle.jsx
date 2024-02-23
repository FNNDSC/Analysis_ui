import { useEffect } from "react";

const useSetDocumentTitle = () => {
	useEffect(() => {
		document.title = "ChRIS LegMeas";
	}, []);
}

export default useSetDocumentTitle;