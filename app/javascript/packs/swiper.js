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

  keyboard: {
    enabled: false,
    pageUpDown: false,
  },
});

const buttonNext   = document.getElementById("next");
const buttonPrev   = document.getElementById("prev")
const Http         = new XMLHttpRequest();
const domain       = 'http://' + window.location.host 
const nextSlideUrl = domain + '/user_reactions/next_slide';
const popupUrl     = domain + '/user_reactions/popup';
const maxSlideId   = 17;

/* シンプルにswiperの矢印がクリックされた時のonclickも見張ろう */
let intervalId;
let currentSlideId = 1;

// キーボード入力時
addEventListener("keydown", handleNavigationKeyEvent);

// 「進む」ボタンクリック時
buttonNext.addEventListener("click", handleButtonNextEvent);
// 「戻る」ボタンクリック時
buttonPrev.addEventListener("click", handleButtonPrevEvent);

function handleButtonNextEvent() {
  if (currentSlideId > 0 && currentSlideId < maxSlideId) {
    /* 関数呼び出しとインクリメントの順番は大事*/
    renderImage(currentSlideId);
    currentSlideId++;
  }
}

function handleButtonPrevEvent() {
  if (currentSlideId > 1) {
    currentSlideId--;
  }
}

/* handleNavicationKeyEvent()
 * 右矢印，エンター，スペースなら次のページへ進む
 * 左矢印ならスライドを戻る
 * クリックをエミュレートしているから，クリックイベントが発生する
 * それによってイベントハンドラーが起動される
 * つまり，キーイベントハンドラー内からクリックイベントハンドラーをよびだす
*/
function handleNavigationKeyEvent(e) {
  if (e.code == 'Enter' || e.code == 'ArrowRight' || e.code == 'Space') {    
    clearInterval(intervalId); 
    buttonNext.click();
  } else if (e.code == 'ArrowLeft') {
    buttonPrev.click();
  }
}

/*
 * 実際にはこの関数ではrenderしていない
 * httpリクエストを投げることでそれに対応したコントローラ内のアクションによってrenderしている
*/
function renderImage(slideId) {
  if (window.location.href.includes("clicked=true")) {
    Http.open("GET", `${nextSlideUrl}?slide_id=${slideId}`);
    Http.send();
  } else if (window.location.href.includes("popup=true")) {
    Http.open("GET", `${popupUrl}?slide_id=${slideId}`);
    Http.send();
    /* deletePopup()を3000ms後に実行 */
    intervalId = setInterval(deletePopup, 3000/*ms*/);
  }
}

function deletePopup() {
  $('#popup-true').html('');
  clearInterval(intervalId);
}

let index = 0;
let array = [1, 1, 1, 1, 1,
             2, 2, 2, 2, 2,
             3, 3, 3, 3, 3,
             2, 2, 2, 2, 2,
             3, 3, 3, 3, 3,
             1, 1, 1, 1, 1
            ]

let array2 = [1, 2, 2, 1, 1, 1, 1, 1, 1, 3,
              2, 3, 3, 2, 2, 2, 2, 2, 2, 1,
              3, 1, 1, 3, 3, 3, 3, 3, 3, 3
             ];
function createReaction() {
  let url = domain + "/user_reactions/new_image?reaction_id=";
  Http.open("GET", url + array2[index] + "&slide_id=" + currentSlideId);
  Http.send();
  index = ++index % array2.length;
}

if (!window.location.href.includes("script_id=0")) {
  setInterval(createReaction, 1000);
} else if (currentSlideId == 17) {
  console.log("finished");
}

/*
*  以下の3つのURLで動きが変わるppはなくても一応大丈夫
*  http://localhost:3000/user_reactions/swiper?pp=disable
*  http://localhost:3000/user_reactions/swiper?pp=disable&popup=true
*  http://localhost:3000/user_reactions/swiper?pp=disable&clicked=true
*/