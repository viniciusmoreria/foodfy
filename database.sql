CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" int,
  "title" text,
  "image" text,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "image" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "files" (
"id" SERIAL PRIMARY KEY,
"name" text,
"path" text,
"recipe_id" int unique
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");