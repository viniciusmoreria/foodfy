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

// Pagination

function paginate(selectedPage, totalPages) {
  let pages = [],
    oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if (
      firstAndLastPage ||
      (pagesBeforeSelectedPage && pagesAfterSelectedPage)
    ) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push("...");
      }

      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }

  return pages;
}

function createPagination(pagination) {
  const filter = pagination.dataset.filter;
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const pages = paginate(page, total);

  let elements = "";

  for (let page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`;
    } else {
      if (filter) {
        elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
      } else {
        elements += `<a href="?page=${page}">${page}</a>`;
      }
    }
  }

  pagination.innerHTML = elements;
}

const pagination = document.querySelector(".pagination");

if (pagination) {
  createPagination(pagination);
}
