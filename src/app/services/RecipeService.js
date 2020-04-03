const Recipe = require("../models/Recipe");

async function getImages(recipeId) {
  let files = await Recipe.files(recipeId);
  files = files.map(file => ({
    ...file,
    src: `${file.path.replace("public", "")}`
  }));

  return files;
}

async function format(recipe) {
  const files = await getImages(recipe.id);
  recipe.img = files[0].src;
  recipe.images = files;

  return recipe;
}

const LoadService = {
  load(service, filter) {
    this.filter = filter;
    return this[service]();
  },
  async recipe() {
    try {
      const recipe = await Recipe.find(this.filter);
      return format(recipe);
    } catch (err) {
      console.error(err);
    }
  },
  async recipes() {
    const recipes = await Recipe.all(this.filter);
    const recipesPromise = recipes.map(format);
    return Promise.all(recipesPromise);
  },
  format
};

module.exports = LoadService;
