import Axios from "axios";

const API_URL = "http://127.0.0.1:8000";
const CROSS_ORIGIN_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Content-Type": "application/json",
};

export interface Event {
	id: number;
	day: number;
	startTime: string;
	endTime: string;
	description: string;
	itinerary_id: number;
}

export interface Itinerary {
	id: number;
	name: string;
	description: string;
	image?: string;
	events: Event[];
}

export interface UserData {
	username: string;
	password: string;
	itineraries: Itinerary[];
	created_at: string;
}


export const emptyUser = (): UserData => ({
	username: "",
	password: "",
	itineraries: [],
	created_at: "",
})


export async function getUserData(username: string): Promise<UserData> {
	const response = await Axios({
		method: "GET",
		url: `${API_URL}/users/${username}`,
		headers: CROSS_ORIGIN_HEADERS,
	});

	const response2 = await Axios({
		method: "GET",
		url: `${API_URL}/users/${username}/itineraries`,
		headers: CROSS_ORIGIN_HEADERS,
	});

	const userCredentials = response.data;
	const userItineraries = response2.data;
	const events: Event[] = [];

	for (let itinerary of userItineraries) {
		const eventRes = await Axios({
			method: "GET",
			url: `${API_URL}/users/${username}/itineraries/${itinerary.id}/events`,
			headers: CROSS_ORIGIN_HEADERS,
		});

		for (let e of eventRes.data) {
			const newEvent: Event = {
				id: e.id,
				day: e.day_number,
				startTime: e.start_time,
				endTime: e.end_time,
				description: e.description,
				itinerary_id: e.itinerary_id,
			};
			events.push(newEvent);
		}
	}

	const itineraries: Itinerary[] = userItineraries.map(
		(itinerary: any): Itinerary => {
			return {
				id: itinerary.id,
				name: itinerary.trip_name,
				image: itinerary.image,
				description: itinerary.description,
				events: events.filter((e) => e.itinerary_id == itinerary.id),
			};
		}
	);

	const userData: UserData = Object.assign(userCredentials, { itineraries });
	console.log("User Data: ", userData);

	return userData;
}


export async function createUser(username: string) {
	const response = await Axios({
		method: "POST",
		url: `${API_URL}/users`,
		headers: CROSS_ORIGIN_HEADERS,
		data: {
			username: username,
			password: '1234'
		}
	});

	return response.data;
} 



export async function createItinerary(username: string, value: Itinerary) {
	const response = await Axios({
		method: "POST",
		url: `${API_URL}/users/${username}/itineraries`,
		headers: CROSS_ORIGIN_HEADERS,
		data: {
			trip_name: value.name,
			description: value.description,
			image: value.image == null ? "" : value.image,
		},
	});

	console.log(response.data);
}


export async function updateItinerary(username: string, itinerary: Itinerary) {
	const response = await Axios({
		method: "PUT",
		url: `${API_URL}/users/${username}/itineraries`,
		headers: CROSS_ORIGIN_HEADERS,
		data: {
			id: itinerary.id,
			trip_name: itinerary.name != "0" ? itinerary.name : null,
			description:
				itinerary.description != "0" ? itinerary.description : null,
			image: itinerary.image != "0" ? itinerary.description : null,
		},
	});

	console.log(response.data);
}


export async function deleteItinerary(username: string, id: number) {
	const response = await Axios({
		method: "DELETE",
		url: `${API_URL}/users/${username}/itineraries`,
		headers: CROSS_ORIGIN_HEADERS,
		data: { id },
	});

	console.log(response.data);
}


export async function addEvent(
	username: string,
	itinerary_id: number,
	event: Event
) {
	const res = await Axios({
		method: "POST",
		url: `${API_URL}/users/${username}/itineraries/${itinerary_id}/events`,
		headers: CROSS_ORIGIN_HEADERS,
		data: {
			day_number: event.day,
			start_time: event.startTime,
			end_time: event.endTime,
			description: event.description,
		},
	});

	console.log("NEW EVENT: ", res.data);
}


export async function updateEvent(
	username: string,
	itinerary_id: number,
	event: Event
) {
	const res = await Axios({
		method: "PUT",
		url: `${API_URL}/users/${username}/itineraries/${itinerary_id}/events`,
		headers: CROSS_ORIGIN_HEADERS,
		data: {
			id: event.id,
			day_number: event.day,
			start_time: event.startTime,
			end_time: event.endTime,
			description: event.description,
		},
	});


	console.log("NEW EVENT: ", res.data);
}


export function readImage(img: File): Promise<string> {
	const returnedData: Promise<string> = new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			console.log("Reading Image");

			if (e.target) {
				const data = e.target.result;

				if (typeof data == "string") {
					console.log("Data: ", data);
					resolve(data);
				} else {
					reject(
						`Data was of type ${typeof data} instead of type 'string'`
					);
				}
			} else {
				reject("File Reader Failed to Load");
			}
		};

		try {
			reader.readAsDataURL(img);
		} catch (TypeError) {
			reject("Image must be of type 'File'");
		}
	});

	return returnedData;
}


export function parseTime(militaryTime: string) {
	let parts = militaryTime.split(":");

	let hour = parseInt(parts[0]);
	let meridiem = "AM";

	if (hour > 12) {
		parts[0] = (hour - 12).toString();
		meridiem = "PM";
	}

	return parts[0] + ":" + parts[1] + " " + meridiem;
}
