import { useState } from "react";
import { Itinerary, readImage, createItinerary } from "../utilities/utilities";
import { AppContext, useUserContext } from "../utilities/context";
import TopBar from "./TopBar";
import "../styles/createItinerary.css";

export default function CreateItinerary() {
	const [assocFile, setAssocFile] = useState<File | null>(null);
	const [tripName, setTripName] = useState("");
	const [tripDescription, setTripDescription] = useState("");

	const username = useUserContext(AppContext).username;

	function cancelCreation() {
		window.location.pathname = "/";
	}

	function onChangeFilename(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (files == null) return;

		setAssocFile(files[files.length - 1]);
		console.log("File: ", files[files.length - 1]);
	}

	function saveItinerary() {
		if (tripName.length < 3) {
			// Handle Error
			return;
		}

		let newItinerary: Itinerary = {
			id: -1,
			name: tripName,
			description: tripDescription,
			events: [],
		};

		if (assocFile != null) {
			readImage(assocFile)
				.then((data) => {
					newItinerary.image = data;
					createItinerary(username, newItinerary);
					window.location.pathname = "/";
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			createItinerary(username, newItinerary);
			window.location.pathname = "/";
		}
	}

	return (
		<>
			<TopBar
				title="Create Itinerary"
				buttonText="Return"
				buttonColor="red"
				buttonAction={cancelCreation}
			/>

			<div className="new-itinerary-container">
				<div className="setting">
					<div>
						<label htmlFor="trip-name">Trip Name</label>
						<input
							type="text"
							id="trip-name"
							placeholder="New York Trip"
							onChange={(e) => setTripName(e.target.value)}
						/>
					</div>

					<hr />
				</div>
				<div className="setting">
					<div>
						<label>Associated Image</label>
						<input
							type="file"
							id="assoc-img"
							onChange={onChangeFilename}
						/>
						<label htmlFor="assoc-img" id="img-btn">
							{assocFile?.name || "Choose File"}
						</label>
					</div>
					<hr />
				</div>
				<div className="setting">
					<div>
						<label htmlFor="trip-desc">Trip Description</label>
						<textarea
							id="trip-desc"
							placeholder="Summer Vacation to see Empire State Building"
							onChange={(e) => setTripDescription(e.target.value)}
						></textarea>
					</div>
					<hr />
				</div>

				<button onClick={saveItinerary}>Create</button>
			</div>
		</>
	);
}
