DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" INTEGER REFERENCES chefs(id),
  "title" text,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "created_at" timestamp DEFAULT (now()),
  "file_id" int 
);

CREATE TABLE "files" (
"id" SERIAL PRIMARY KEY,
"name" text,
"path" text NOT NULL
);

CREATE TABLE "recipe_files" (
"id" SERIAL PRIMARY KEY,
"recipe_id",
"file_id" 
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

-- foreign key
ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN 
  NEW.updated_at = NOW();
  RETURN NEW
END;
$$ LANGUAGE plpgsql;

-- auto updated_at recipes
CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- auto updated_at users
CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- connect pg simple table

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)

WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;