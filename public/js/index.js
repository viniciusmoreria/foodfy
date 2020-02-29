const recipes = document.querySelectorAll(".recipe");
const hide = document.querySelectorAll("#hide");

for (let i = 0; i < recipes.length; i++) {
  recipes[i].addEventListener("click", function() {
    window.location.href = `/recipe/${i}`;
  });
}

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
