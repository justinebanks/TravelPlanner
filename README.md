# Travel Planner
A quick travel planner app made using ReactJS on the Frontend, FastAPI in Python for the backend, and PostgreSQL as the database

## Building the Backend
To get the API and Database running, create a PostgreSQL database called "travel-planner" and use the pgAdmin Query Tool on it to copy and paste all the SQL code from backend/db.sql into it.

To run the API, you first need to install its dependencies: fastapi and psycopg2. Installing fastapi should also automatically install pydantic and uvicorn, but if it doesn't just manually install those too.
```batch
pip install fastapi psycopg2
pip install uvicorn pydantic
```
Once the dependencies are installed, just run the app with the following command from the home directory of the respository.
```
python -m uvicorn backend.main:app --reload
```
## Building the Frontend
Getting the Frontend setup should be a lot easier than the backend. simply enter the 'frontend' folder, install the dependencies and run the vite dev server.
```
cd frontend
npm install
npm run dev
```
Its assumed in the code that the API is running on 127.0.0.1:8000 (localhost).
This can be changed by changing the API_URL variable in the 'frontend/utilities/utilities.tsx' file.

## A Few Things Gone Wrong
This project definitely could use some better authentication, but I made as a quick test of my Fullstack Web Development knowledge, so I wasn't planning on making it perfect.

One other problem is the images. Each itinerary is meant to have an associated image, but storing images in the database turned out to be a huge mistake, so I disabled it.
