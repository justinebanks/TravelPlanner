from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from pydantic import BaseModel

from .models import execute_db_command, get_selected_users, User
from .routes import itineraries, events

app = FastAPI()
app.include_router(itineraries.router)
app.include_router(events.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserParams(BaseModel):
    username: str
    password: str


@app.get("/users")
def get_users():
    all_users = execute_db_command("SELECT * FROM users;", User)
    return all_users


@app.post("/users")
def create_user(user: UserParams):
    try:
        insertion = "INSERT INTO users (username, password) VALUES (%s, %s) RETURNING *;"
        created_user = execute_db_command(insertion, User, [user.username, user.password])[0]
    
    except psycopg2.errors.UniqueViolation:
        raise HTTPException(status_code=403, detail=f"Username '{user.username}' Already Exists in Database")

    return created_user.model_dump()


@app.get("/users/{username}")
def get_user(username: str):
    selected_users = get_selected_users(username)
    return selected_users[0].model_dump()


@app.delete("/users/{username}")
def remove_user(username: str):
    selected_users = get_selected_users(username)

    if selected_users:
        execute_db_command("DELETE FROM users WHERE username = %s;", params=[username])

    return { "success": True }
