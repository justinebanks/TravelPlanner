from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel

from ..models import Itinerary, get_selected_users, get_selected_itineraries, execute_db_command

router = APIRouter(
    prefix="/users/{username}/itineraries",
    tags=["itineraries"]
)

class CreateItineraryParams(BaseModel):
    trip_name: str
    description: str
    image: str


class UpdateItineraryParams(BaseModel):
    id: int
    trip_name: str | None
    description: str | None
    image: str | None


@router.get("/")
def get_itineraries(username: str):
    data = get_selected_itineraries(username)
    return data


@router.post("/")
def create_itinerary(username: str, itinerary: CreateItineraryParams):
    selected_user_id = get_selected_users(username)[0].id

    new_itinerary = execute_db_command("""--sql
        INSERT INTO itineraries (trip_name, description, image, user_id) 
        VALUES (%s, %s, %s, %s::INTEGER) 
        RETURNING *;
                                       
        """, Itinerary, [*itinerary.model_dump().values(), selected_user_id]
    )

    return new_itinerary


@router.put("/")
def update_itinerary(username: str, itinerary: UpdateItineraryParams):
    selected_itinerary = get_selected_itineraries(username, itinerary.id)[0]


    if itinerary.trip_name != None:
        execute_db_command("UPDATE itineraries SET trip_name = %s WHERE id = %s;", params=[itinerary.trip_name, itinerary.id])
    if itinerary.description != None:
        execute_db_command("UPDATE itineraries SET description = %s WHERE id = %s;", params=[itinerary.description, itinerary.id])
    if itinerary.image != None:
        execute_db_command("UPDATE itineraries SET image = %s WHERE id = %s;", params=[itinerary.image, itinerary.id])

    return get_selected_itineraries(username, itinerary.id)[0]


@router.delete("/")
def remove_itinerary(username: str, id: int = Body(embed=True)):
    #selected_itinerary = get_selected_itineraries(username, id)[0]

    #if selected_itinerary.username == username:
        removed_user = execute_db_command("DELETE FROM itineraries WHERE id = %s RETURNING *;", params=[id])
        return { "success": True } # removed_user
    #else:
    #    raise HTTPException(status_code=400, detail=f"Itinerary of ID '{id}' does not belong to user '{username}'")
    

@router.get("/{itinerary_id}")
def get_itinerary(username: str, itinerary_id: int):
    return get_selected_itineraries(username, itinerary_id)[0]