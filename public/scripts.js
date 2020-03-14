//Active Tab Logic
const currentPage = location.pathname;
const menuItems = document.querySelectorAll(".navbar a");

for (item of menuItems) {
  if (currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active");
  }
}

//Hide Detail Toggle
const hide = document.querySelectorAll("#hide");
for (let i = 0; i < hide.length; i++) {
  hide[i].addEventListener("click", function() {
    document.querySelector("#lista" + i).classList.toggle("hiding");

    if (document.querySelector("#lista" + i).classList.contains("hiding")) {
      hide[i].innerHTML = "MOSTRAR";
    } else {
      hide[i].innerHTML = "ESCONDER";
    }
  });
}

//Delete confirmation
const formDelete = document.querySelector("#form-delete");

if (formDelete) {
  formDelete.addEventListener("submit", function(event) {
    const confirmation = confirm("Deseja deletar a receita?");
    if (!confirmation) {
      event.preventDefault();
    }
  });
}

//Adding new ingredients and new steps for the recipes

const addIngredientBtn = document.querySelector(".add-ingredient");
const addStepBtn = document.querySelector(".add-step");

if (addIngredientBtn && addStepBtn) {
  addIngredientBtn.addEventListener("click", addIngredient);
  addStepBtn.addEventListener("click", addStep);

  //Add New Recipe Ingredient
  function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");

    // Clone the last added ingredient
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Dont add new value if the last one was null
    if (newField.children[0].value == "") return false;

    // Reset input value
    newField.children[0].value = "";
    ingredients.appendChild(newField);
  }

  //Add New Recipe Step

  function addStep() {
    const steps = document.querySelector("#steps");
    const fieldContainer = document.querySelectorAll(".step");

    // Clone the last added step
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Dont add new value if the last one was null
    if (newField.children[0].value == "") return false;

    // Reset input value
    newField.children[0].value = "";
    steps.appendChild(newField);
  }
}
