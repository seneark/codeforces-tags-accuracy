import "./App.css";
import Router from "./Router/Routes";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";

function App() {
	return (
		<div>
			<BrowserRouter>
				<NextUIProvider>
					<Router />
				</NextUIProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
