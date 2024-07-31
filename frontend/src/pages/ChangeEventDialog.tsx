import { useRef } from "react";
import { addEvent, Event, updateEvent } from "../utilities/utilities.tsx";
import { AppContext, useUserContext } from "../utilities/context.ts";

export enum ChangeMode {
  UPDATE,
  CREATE,
}

interface DialogAttributes {
  ref_: React.RefObject<HTMLDivElement>;
  changeMode: ChangeMode;
  event: Event | null;
  itinerary_id: number;
}

export function ChangeEventDialog(attrs: DialogAttributes) {
  const { changeMode, event, ref_, itinerary_id } = attrs;
  const user = useUserContext(AppContext);

  const dayRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  function saveEvent() {
	if (dayRef.current && startRef.current && endRef.current && descRef.current) {
		const newEvent: Event = {
			id: -1,
			itinerary_id,

			day: parseInt(dayRef.current.value) > 0 ? parseInt(dayRef.current.value) : 1,
			startTime: startRef.current.value,
			endTime: endRef.current.value,
			description: descRef.current.value
		}

		if (event && changeMode == ChangeMode.UPDATE) {
			newEvent.id = event.id
			updateEvent(user.username, itinerary_id, newEvent);
		}
		else if (changeMode == ChangeMode.CREATE) {
			addEvent(user.username, itinerary_id, newEvent);
			
		}

		if (ref_.current) {
			ref_.current.style.display = "none";
			window.location.reload();
		}
		
	}
  }

  function cancelChange() {
	if (ref_.current) {
		ref_.current.style.display = "none";
	}
  }

  return (
    <div className="change-dialog" ref={ref_}>
    	<h1>{changeMode == ChangeMode.UPDATE ? "Edit Event" : "Create Event"}</h1>

		<button className="cancel-button" onClick={cancelChange}>X</button>

    	<label htmlFor="day">Day Number</label>
    	<input ref={dayRef} id="day" type="number" defaultValue={event?.day} />

		<div className="time-container">
			<div className="time-input">
				<label htmlFor="start-time">Start Time</label>
				<input
				id="start-time"
				type="time"
				defaultValue={event?.startTime}
				ref={startRef}
				/>
			</div>

			<div className="time-input">
				<label htmlFor="end-time">End Time</label>
				<input
				id="end-time"
				type="time"
				defaultValue={event?.endTime}
				ref={endRef}
				/>
			</div>
		</div>

		<label htmlFor="desc">Description</label>
		<textarea
			id="desc"
			defaultValue={event?.description}
			ref={descRef}
		/>

		<button onClick={saveEvent} className="save-event">
			Save Event
		</button>
    </div>
  );
}
