//---------- Active Tab Logic ----------//
const currentPage = location.pathname;
const menuItems = document.querySelectorAll(".navbar a");

for (item of menuItems) {
  if (currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active");
  }
}

//---------- Hide Detail Toggle ----------//

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

//---------- Delete confirmation ----------//

const formDelete = document.querySelector("#form-delete");

if (formDelete) {
  formDelete.addEventListener("submit", function(event) {
    const confirmation = confirm("Tem certeza de que deseja prosseguir?");
    if (!confirmation) {
      event.preventDefault();
    }
  });
}

//---------- Adding new ingredients and new steps for the recipes ----------//

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

//---------- Pagination ----------//

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

//---------- Photo Upload Logic ----------//

const PhotosUpload = {
  input: "",
  preview: document.querySelector(".photos_preview"),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event)) return;

    Array.from(fileList).forEach(file => {
      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result);

        const div = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(div);
      };

      reader.readAsDataURL(file);
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} imagens`);
      event.preventDefault();
      return true;
    }

    const photosDiv = [];
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList == "photo") photosDiv.push(item);
    });

    const totalPhotos = fileList.length + photosDiv.length;
    if (totalPhotos > uploadLimit) {
      alert("Limite máximo de imagens atingido");
      event.preventDefault();
      return true;
    }

    return false;
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer();

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement("div");
    div.classList.add("photo");

    div.onclick = PhotosUpload.removePhoto;

    div.appendChild(image);

    div.appendChild(PhotosUpload.getRemoveBtn());

    return div;
  },
  getRemoveBtn() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "close";
    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode;
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    PhotosUpload.files.splice(index, 1);
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photoDiv.remove();
  },
  removeOldImage(event) {
    const photoDiv = event.target.parentNode;

    if (photoDiv.id) {
      const removedFiles = document.querySelector(
        'input[name="removed_files"]'
      );
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`;
      }
    }

    photoDiv.remove();
  }
};

//---------- Image Gallery and Lightbox Logic ----------//

const ImageGallery = {
  highlight: document.querySelector(".highlight > img"),
  previews: document.querySelectorAll(".gallery_preview img"),
  setImage(e) {
    const { target } = e;

    ImageGallery.previews.forEach(preview =>
      preview.classList.remove("active")
    );
    target.classList.add("active");

    ImageGallery.highlight.src = target.src;
    Lightbox.image.src = target.src;
  }
};

const Lightbox = {
  target: document.querySelector(".lightbox_target"),
  image: document.querySelector(".lightbox_target img"),
  closeBtn: document.querySelector(".lightbox_target .lightbox_close"),
  open() {
    Lightbox.target.style.opacity = 1;
    Lightbox.target.style.top = 0;
    Lightbox.target.style.bottom = 0;
    Lightbox.closeBtn.style.opacity = 1;
  },
  close() {
    Lightbox.target.style.opacity = 0;
    Lightbox.target.style.top = "-100%";
    Lightbox.target.style.bottom = "initial";
    Lightbox.closeBtn.style.opacity = 0;
  }
};

//---------- Validation ----------//

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input);

    let results = Validate[func](input.value);
    input.value = results.value;

    if (results.error) Validate.displayError(input, results.error);
  },
  displayError(input, error) {
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerHTML = error;
    input.parentNode.appendChild(div);
    input.parentNode.style.color = "red";

    const inputDiv = document.querySelector("input[type=email]");
    inputDiv.style.outline = "1px solid red";

    input.focus();
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector(".error");
    const inputDiv = document.querySelector("input[type=email]");
    if (errorDiv) errorDiv.remove();
    inputDiv.style.outline = "none";
  },
  isEmail(value) {
    let error = null;

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(mailFormat)) error = "E-mail inválido.";

    return {
      error,
      value
    };
  },
  allFields(e) {
    const items = document.querySelectorAll("input, select");

    for (item of items) {
      if (item.value == "") {
        const message = document.createElement("div");
        message.classList.add("messages");
        message.classList.add("error");
        message.style.position = "fixed";
        message.innerHTML = "Por favor, preencha todos os campos";
        document.querySelector("body").append(message);

        e.preventDefault();
      }
    }
  }
};
