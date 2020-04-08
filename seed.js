const faker = require("faker");
const { hash } = require("bcryptjs");
const { date } = require("./src/lib/utils");

const User = require("./src/app/models/User");
const Chef = require("./src/app/models/Chef");
const Recipe = require("./src/app/models/Recipe");
const File = require("./src/app/models/File");
const RecipeFile = require("./src/app/models/RecipeFile");

let usersIds = [],
  chefsIds = [],
  recipesIds = [],
  recipesImages = [],
  totalUsers = 5,
  totalChefs = 7,
  totalRecipes = 15;

async function createUsers() {
  const users = [];
  const password = await hash("pass", 8);

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      password,
      is_admin: true,
    });
  }

  const usersPromise = users.map((user) => User.create(user));

  usersIds = await Promise.all(usersPromise);
}

async function createChefs() {
  let files = [];
  let n = 0;

  while (files.length < totalChefs) {
    files.push({
      name: faker.name.findName(),
      path: `https://source.unsplash.com/collection/2013520/640x480`,
    });
  }
  const filesPromise = files.map((file) => File.create(file));
  filesId = await Promise.all(filesPromise);

  let chefs = [];

  while (chefs.length < totalChefs) {
    chefs.push({
      name: faker.name.findName(),
      created_at: date(Date.now()).iso,
      file_id: filesId[n],
    });
    n += 1;
  }

  const chefsPromise = chefs.map((chef) => Chef.create(chef));
  chefsIds = await Promise.all(chefsPromise);
}

async function createRecipes() {
  let recipes = [];

  while (recipes.length < totalRecipes) {
    recipes.push({
      chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
      user_id: usersIds[Math.floor(Math.random() * totalUsers)],
      title: faker.commerce.product(),
      ingredients: [faker.lorem.lines(5)],
      preparation: [faker.lorem.lines(5)],
      information: faker.lorem.paragraph(),
    });
  }

  const recipesPromise = recipes.map((recipe) => Recipe.create(recipe));
  recipesIds = await Promise.all(recipesPromise);

  let files = [];

  while (files.length < totalRecipes) {
    files.push({
      name: faker.commerce.productName(),
      path: "https://source.unsplash.com/collection/251966/640x480",
    });
  }

  const filesPromise = files.map((file) => File.create(file));
  recipesImages = await Promise.all(filesPromise);
}

async function createRecipeFile() {
  let recipeFiles = [];
  let n = 0;

  while (recipeFiles.length < totalRecipes) {
    recipeFiles.push({
      recipe_id: recipesIds[n],
      file_id: recipesImages[n],
    });

    n += 1;
  }

  const recipeFilesPromise = recipeFiles.map((recipeFile) =>
    RecipeFile.create(recipeFile)
  );

  await Promise.all(recipeFilesPromise);
}

async function init() {
  await createUsers(),
    await createChefs(),
    await createRecipes(),
    await createRecipeFile();
}

init();
