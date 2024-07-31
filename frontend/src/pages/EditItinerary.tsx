import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext, useUserContext } from "../utilities/context";
import {
	Event,
	Itinerary,
	readImage,
	parseTime,
	updateItinerary
} from "../utilities/utilities";
import TopBar from "./TopBar";
import Loading from "./Loading";
import { ChangeMode, ChangeEventDialog } from "./ChangeEventDialog";
import "../styles/edititinerary.css";

export default function EditItinerary() {
	console.log("EDIT ITINERARY RE-RENDER");

	const changeDialogRef = useRef<HTMLDivElement>(null);

	const [changeMode, setChangeMode] = useState<ChangeMode>(ChangeMode.CREATE);
	const [changeEvent, setChangeEvent] = useState<Event | null>(null);
	const [changedItinerary, setChangedItinerary] = useState<number>(-1);

	const user = useUserContext(AppContext);
	const { idString } = useParams();

	// ID Query Param Null Check
	if (idString === undefined) {
		window.location.pathname = "/";
		return;
	}

	if (user.username == "") {
		return <Loading />;
	}

	const itinerary = user.itineraries.filter(
		(i) => i.id == parseInt(idString)
	)[0];

	// Itinerary null check
	if (itinerary === undefined) {
		return (
			<h1>
				Error: Invalid ID for itinerary belonging to user{" "}
				{user.username}
			</h1>
		);
	}

	function showDialog(mode: ChangeMode, event_id: number | null) {
		if (changeDialogRef.current != null) {
			changeDialogRef.current.style.display = "flex";
			setChangeMode(mode);
			setChangeEvent(itinerary.events.filter((e) => e.id == event_id)[0]);
			setChangedItinerary(itinerary.id);
		}
	}

	function saveChanges(newItinerary: Itinerary) {
		console.log("SAVED CHANGES: ", newItinerary);
		updateItinerary(user.username, newItinerary);
	}

	async function editImage(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (files == null) return;

		const imageData = await readImage(files[files.length - 1]);
		saveChanges({
			id: itinerary.id,
			name: "0",
			description: "0",
			image: imageData,
			events: [],
		});
	}

	function editDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
		saveChanges({
			id: itinerary.id,
			name: "0",
			description: e.target.value,
			image: "0",
			events: [],
		});
	}

	function editTripName(e: React.ChangeEvent<HTMLInputElement>) {
		saveChanges({
			id: itinerary.id,
			name: e.target.value,
			description: "0",
			image: "0",
			events: [],
		});
	}

	return (
		<>
			<TopBar
				title="Edit Itinerary"
				buttonText="Exit"
				buttonColor="green"
				buttonAction={() => (window.location.pathname = "/")}
			/>

			<input
				type="text"
				className="itinerary-name-input"
				defaultValue={itinerary.name}
				onChange={editTripName}
			/>

			<div className="itinerary-info">
				<textarea
					id="edit-description"
					onChange={editDescription}
					defaultValue={itinerary.description}
				></textarea>
				<input type="file" id="change-image" onChange={editImage} />{" "}
				<label htmlFor="change-image">
					<img src={itinerary.image ? itinerary.image : ""} />
				</label>
			</div>

			<table className="itinerary-events">
				<thead>
					<tr>
						<th>Day</th>
						<th>Time Frame</th>
						<th>Description</th>
						<th></th>
					</tr>
				</thead>

				<tbody>
					{itinerary.events.map((e) => (
						<tr className="event" key={e.id}>
							<td>Day {e.day}</td>
							<td>
								{parseTime(e.startTime)} -{" "}
								{parseTime(e.endTime)}
							</td>
							<td>{e.description}</td>
							<td>
								<button
									onClick={() =>
										showDialog(ChangeMode.UPDATE, e.id)
									}
									className="edit-event"
								>
									Edit
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<button
				onClick={() => showDialog(ChangeMode.CREATE, null)}
				className="add-event"
			>
				Add New Event
			</button>

			{/*   CHANGE DIALOG SECTION   */}

			<ChangeEventDialog
				ref_={changeDialogRef}
				changeMode={changeMode}
				event={changeEvent}
				itinerary_id={changedItinerary}
			/>
		</>
	);
}
