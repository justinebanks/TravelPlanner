
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS itineraries CASCADE;
DROP TABLE IF EXISTS events CASCADE;

DROP TRIGGER IF EXISTS user_creation_trigger ON users CASCADE;

DROP FUNCTION IF EXISTS insert_user_creation_date();
DROP FUNCTION IF EXISTS create_itinerary(username VARCHAR, trip_name_ VARCHAR, description_ VARCHAR);
DROP FUNCTION IF EXISTS get_user_itineraries(username_ VARCHAR);
DROP FUNCTION IF EXISTS get_event_relationships(_event_id INTEGER);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    trip_name VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    image TEXT,
    user_id INTEGER NOT NULL,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    day_number INTEGER NOT NULL CHECK (day_number > 0),
    start_time TIME NOT NULL,
    end_time TIME,
    description VARCHAR(500),
    itinerary_id INTEGER,

    CONSTRAINT fk_itinerary
        FOREIGN KEY (itinerary_id)
        REFERENCES itineraries(id)
);


CREATE FUNCTION insert_user_creation_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = NOW();
    RETURN NEW;
END
$$ LANGUAGE plpgsql;


CREATE TRIGGER user_creation_trigger
BEFORE INSERT
ON users
FOR EACH ROW
EXECUTE PROCEDURE insert_user_creation_date();


CREATE FUNCTION create_itinerary(username VARCHAR, trip_name_ VARCHAR, description_ VARCHAR)
RETURNS INTEGER AS $$
DECLARE
 the_user_id INTEGER;
BEGIN
    SELECT id INTO the_user_id
    FROM users
    WHERE users.name = username
    ORDER BY id;

    INSERT INTO itineraries (trip_name, description, image, user_id)
    VALUES (trip_name_, description_, '', the_user_id);

	RETURN 0;
END
$$ LANGUAGE plpgsql;


CREATE FUNCTION get_user_itineraries(username_ VARCHAR)
RETURNS TABLE (
    id INTEGER,
    trip_name VARCHAR,
    description VARCHAR,
    image TEXT,
    user_id INTEGER,
    username VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
		itineraries.id, 
		itineraries.trip_name, 
		itineraries.description,
		itineraries.image,
		itineraries.user_id,
        users.username
    FROM itineraries
    JOIN users ON users.id = itineraries.user_id
    WHERE users.username = username_;
END
$$ LANGUAGE plpgsql;


CREATE FUNCTION get_event_relationships(_event_id INTEGER)
RETURNS TABLE (
	event_id INTEGER,
	itinerary_id INTEGER,
	username VARCHAR
) AS $$
BEGIN
	RETURN QUERY
	SELECT events.id, itineraries.id, users.username
	FROM events 
	JOIN itineraries ON itineraries.id = events.itinerary_id 
	JOIN users ON users.id = itineraries.user_id
	WHERE events.id = _event_id;
END
$$ LANGUAGE plpgsql;
