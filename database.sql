CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" INTEGER REFERENCES chefs(id),
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
"path" text NOT NULL
);

CREATE TABLE "recipe_files" (
"id" SERIAL PRIMARY KEY,
"recipe_id" INTEGER REFERENCES recipes(id),
"file_id" INTEGER REFERENCES files(id)
);


