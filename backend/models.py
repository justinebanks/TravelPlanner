import psycopg2
from pydantic import BaseModel
from typing import Any
import datetime as dt
from fastapi import HTTPException

conn = psycopg2.connect(host="localhost", port="5432", dbname="travel-planner", user="postgres", password="LaVaLoRd4953")


class User(BaseModel):
    id: int
    username: str
    password: str
    create_at: dt.datetime
              

class Itinerary(BaseModel):
    id: int
    trip_name: str
    description: str
    image: str
    user_id: int # fk


class Event(BaseModel):
    id: int
    day_number: int
    start_time: dt.time
    end_time: dt.time
    description: str
    itinerary_id: int # fk


def query_to_instance(cls, data: list[tuple[Any, ...]]) -> list:
    rows = []

    if cls == None:
        return []

    for row in data:
        attrs = { key: row[i] for (i, key) in enumerate(cls.model_fields.keys()) }
        rows.append(cls(**attrs))
        
    return rows


def execute_db_command(command: str, output_type=None, params=None):
    global conn
    cursor = conn.cursor()
    data = []

    cursor.execute(command) if params is None else cursor.execute(command, params)

    try:
        data = cursor.fetchall()
    except psycopg2.ProgrammingError:
        print("NOTICE: SQL Statement Ran Without Returning a Value")

    conn.commit()
    cursor.close()
    
    return query_to_instance(output_type, data)


def get_selected_users(username: str):
    selected_users = execute_db_command("SELECT * FROM users WHERE username = %s;", User, [username])

    if len(selected_users) == 0:
        raise HTTPException(status_code=404, detail="Specified user does not exist")
    else:
        return selected_users


def get_selected_itineraries(username: str, id_: int = None):
    if id_ is None:
        selected_itineraries = execute_db_command("SELECT * FROM get_user_itineraries(%s);", Itinerary, [username])
    else:
        selected_itineraries = execute_db_command("SELECT * FROM get_user_itineraries(%s) WHERE id = %s;", Itinerary, [username, id_])

    return selected_itineraries


def get_selected_events(username: str, itinerary_id: int, id_: int = None):
    selected_user = get_selected_users(username)[0]
    selected_itinerary = get_selected_itineraries(username, itinerary_id)[0]

    if id_ is None:
        selected_events = execute_db_command("SELECT * FROM events WHERE itinerary_id = %s ORDER BY day_number,  start_time;", Event, [itinerary_id])
    else:
        selected_events = execute_db_command("SELECT * FROM events WHERE itinerary_id = %s AND id = %s ORDER BY day_number,  start_time;", Event, [itinerary_id, id_])

    if selected_itinerary.user_id == selected_user.id:
        return selected_events



if __name__ == "__main__":
    data = get_selected_events('justinebanks', 2)
    print(data)
    # Learn COMMIT, ROLLBACK
