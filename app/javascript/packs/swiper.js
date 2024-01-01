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
const buttonPrev = document.getElementById("prev")
const Http       = new XMLHttpRequest();
const domain     = 'http://' + window.location.host 
const nextUrl    = domain + '/user_reactions/next_slide';
const popupUrl   = domain + '/user_reactions/popup';

addEventListener("keydown", renderPopup);
addEventListener("keydown", renderImage);

/* シンプルにswiperの矢印がクリックされた時のonclickも見張ろう */

function renderImage(event) {
  /* 右矢印，エンター，スペースなら次のページへ進む */
  console.log(event.key);
  buttonNext.click();
  Http.open("GET", nextUrl);
  Http.send();
}

let id;
function renderPopup(e) {
  buttonNext.click();
  Http.open("GET", popupUrl);
  Http.send();
  id = setInterval(deletePopup, 3000)
}

function deletePopup() {
  $('#popup-true').html('');
  clearInterval(id);
}

/*
*  いかの3つのURLで動きが変わるppはなくても一応大丈夫
*  http://localhost:3000/user_reactions/swiper?pp=disable
*  http://localhost:3000/user_reactions/swiper?pp=disable&popup=true
*  http://localhost:3000/user_reactions/swiper?pp=disable&clicked=true
*/