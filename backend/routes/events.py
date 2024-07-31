from fastapi import APIRouter, Body, HTTPException
from ..models import Event, get_selected_events, execute_db_command
from pydantic import BaseModel
import datetime as dt

router = APIRouter(
    prefix="/users/{username}/itineraries/{itinerary_id}/events",
    tags=["itineraries"]
)

class CreateEventParams(BaseModel):
    day_number: int
    start_time: str
    end_time: str
    description: str


class UpdateEventParams(BaseModel):
    id: int
    day_number: int | None
    start_time: str | None
    end_time: str | None
    description: str | None


class EventRelationships(BaseModel):
    event_id: int
    itinerary_id: int
    username: str


@router.get("/")
def get_itinerary_events(username: str, itinerary_id: int):
    return get_selected_events(username, itinerary_id)


@router.post("/")
def add_itinerary_event(username: str, itinerary_id: int, event: CreateEventParams):
    
    new_event = execute_db_command("""--sql
        INSERT INTO events (day_number, start_time, end_time, description, itinerary_id) 
        VALUES (%s, %s::TIME, %s::TIME, %s, %s)
        RETURNING *;
    """, Event, [*event.model_dump().values(), itinerary_id])

    return new_event
    

@router.put("/")
def udpate_itinerary_event(username: str, itinerary_id: int, event: UpdateEventParams):
    if event.day_number != None:
        execute_db_command("UPDATE events SET day_number = %s WHERE id = %s;", params=[event.day_number, event.id])
    if event.start_time != None:
        execute_db_command("UPDATE events SET start_time = %s WHERE id = %s;", params=[event.start_time, event.id])
    if event.end_time != None:
        execute_db_command("UPDATE events SET end_time = %s WHERE id = %s;", params=[event.end_time, event.id])
    if event.description != None:
        execute_db_command("UPDATE events SET description = %s WHERE id = %s;", params=[event.description, event.id])
    
    return get_selected_events(username, itinerary_id, event.id)


@router.delete("/")
def delete_itinerary_event(username: str, itinerary_id: int, event_id: int = Body(embed=True)):
    er = execute_db_command("SELECT * FROM get_event_relationships(%s);", EventRelationships, [event_id])[0]

    if er.username == username and er.itinerary_id == itinerary_id:
        execute_db_command("DELETE FROM events WHERE id = %s;", params=[event_id])
        return { "success": True }
    else:
        raise HTTPException(status_code=404, detail=f"Cannot Find Event of id {event_id} belonging to itinerary of id {itinerary_id} under user {username}")