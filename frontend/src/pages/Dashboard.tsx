import { Itinerary } from "../utilities/utilities.tsx";
import { AppContext, useUserContext } from "../utilities/context.ts";
import TopBar from "./TopBar.tsx";
import Loading from "./Loading.tsx";
import "../styles/dashboard.css";

export default function Dashboard() {
	console.log("DASHBOARD RE-RENDER");

	const user = useUserContext(AppContext);
	const itineraries = user.itineraries;

	if (user.username == "") {
		//setTimeout(() => {  }, 1000)
		return <Loading />;
	}

	function onCreateItineraryClicked() {
		window.location.pathname = "/create-itinerary";
	}

	function onEditItinerary(itemId: number) {
		window.location.pathname = `/itinerary/${itemId}`;
	}

	return (
		<>
			<TopBar
				title="Travel Planner"
				buttonText="Create Itinerary"
				buttonColor="green"
				buttonAction={onCreateItineraryClicked}
			/>

			<div className="itineraries">
				<h2>Recent Itineraries</h2>
				<hr style={{ color: "white" }} />

				<div className="grid-container">
					{itineraries.map((item: Itinerary) => (
						<div
							key={item.id}
							onClick={() => onEditItinerary(item.id)}
							className="itinerary"
						>
							<div className="img-container">
								<img src={item.image ? item.image : ""} />
							</div>
							<p>{item.name}</p>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
