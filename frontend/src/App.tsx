import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppContext, UserContext } from "./utilities/context.ts";
import { emptyUser, getUserData, createUser, UserData } from "./utilities/utilities.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CreateItinerary from "./pages/CreateItinerary.tsx";
import EditItinerary from "./pages/EditItinerary.tsx";
import "./App.css";
import Login from "./pages/Login.tsx";

function App() {
	console.log("APP RE-RENDER")
	const [user, setUser] = useState<UserData>(emptyUser());

	const ctxValue: UserContext = { user, setUser };

	useEffect(() => {
		const currentUser = localStorage.getItem("user");

		if (currentUser == null) {
			getUserData("guest").then((data: UserData) => {
				setUser(data);
				localStorage.setItem("user", "guest");
			});
		}
		else {
			getUserData(currentUser)
				.then((data: UserData) => {
					setUser(data);
					ctxValue.user = data;
				})
				.catch((_) => {
					createUser(currentUser);
					getUserData(currentUser).then((data: UserData) => {
						setUser(data);
						ctxValue.user = data;
					})
				})
		}

	}, []);


	return (
		<AppContext.Provider value={ctxValue}>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/" element={<Dashboard />} />
				<Route path="/create-itinerary" element={<CreateItinerary />} />
				<Route
					path="/itinerary/:idString"
					element={<EditItinerary />}
				/>
			</Routes>
		</AppContext.Provider>
	);
}

export default App;
