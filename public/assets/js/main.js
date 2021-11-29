window.addEventListener("DOMContentLoaded", function () {
  var nav = document.querySelector(".page-header nav");
  console.log(nav);

  document
    .querySelector(".page-header .hamburger-btn")
    .addEventListener("click", function () {
      nav.classList.add("show");
      document.body.style.setProperty("overflow", "hidden");
    });

  document.querySelectorAll(".page-header nav a").forEach(function (elm) {
    elm.addEventListener("click", function (event) {
      nav.classList.remove("show");
      document.body.style.removeProperty("overflow");
    });
  });

  document
    .querySelector(".page-header nav button")
    .addEventListener("click", function () {
      nav.classList.remove("show");
      document.body.style.removeProperty("overflow");
    });
});
