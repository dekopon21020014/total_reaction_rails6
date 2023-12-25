const swiper = new Swiper('.swiper', {
  // Optional parameters
  // direction: 'vertical',
  loop: false,
  effect: 'fade', /* fade かslide(なし)*/

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});
const buttonNext = document.getElementById("next");
const Http     = new XMLHttpRequest();
const nextUrl  = 'http://localhost:3000/user_reactions/next_slide';
const popupUrl = 'http://localhost:3000/user_reactions/popup';

addEventListener("keydown", renderPopup);
addEventListener("keydown", renderImage);

function renderImage() {
  buttonNext.click();
  Http.open("GET", nextUrl);
  Http.send();
  /*
  Http.onreadystatechange = (e) => {
    console.log(Http.responseText)
  }
  */
}

let id;
function renderPopup() {
  buttonNext.click();
  Http.open("GET", popupUrl);
  Http.send();
  id = setInterval(deletePopup, 3000)
}

function deletePopup() {
  $('#popup-true').html('');
  clearInterval(id);
}
