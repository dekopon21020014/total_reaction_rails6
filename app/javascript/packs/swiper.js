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
const newImageUrl  = domain + '/user_reactions/new_image';
const maxSlideId   = 14;

/* シンプルにswiperの矢印がクリックされた時のonclickも見張ろう */
let popupIntervalId;
let scenarioIntervalId;
let currentSlideId = 1;
let currentURL = window.location.href;

if (window.location.href.includes("traditional=true")) {
  addEventListener("keydown", traditionalKeyEvent);
} else if(currentURL.includes("twice=true")) {
  addEventListener("keydown", traditionalTwiceKeyEvent);
} else if (window.location.href.includes("clicked=true")){
  addEventListener("keydown", clickedKeyEvent);
} else if (window.location.href.includes("popup=true")) {
  addEventListener("keydown", popupKeyEvent);
}

/* 
 * 従来手法
 * リアクションが来たら単純に一番下に表示する
 * 上方向にスクロールされているように見えるような方式
*/
function traditionalKeyEvent(e) {
  if (e.code == 'Enter' || e.code == 'ArrowRight' || e.code == 'Space') {
    buttonNext.click();
    currentSlideId++;
    i = (currentSlideId - 2) % scenario.length;
    j = 0;
    if (currentSlideId == 2) {
      clearInterval(scenarioIntervalId);
      scenarioIntervalId = setInterval(appendImage, interval[j]*2);
    } else if (currentSlideId == maxSlideId) {
      clearInterval(scenarioIntervalId);
    }
  } else if (e.code == 'ArrowLeft') {
    buttonPrev.click();
    currentSlideId--;
  }
}

/*
 * 内容は従来手法だが，リアクション数を倍にする．
 * 参加者が2倍になってリアクションが増えた想定
*/
function traditionalTwiceKeyEvent(e) {
  if (e.code == 'Enter' || e.code == 'ArrowRight' || e.code == 'Space') {
    buttonNext.click();
    currentSlideId++;
    i = (currentSlideId - 2) % scenario.length;
    j = 0;
    if (currentSlideId == 2) {
      clearInterval(scenarioIntervalId);
      scenarioIntervalId = setInterval(appendTwiceImage, interval[j]);
    } else if (currentSlideId == maxSlideId) {
      clearInterval(scenarioIntervalId);
    }
  } else if (e.code == 'ArrowLeft') {
    buttonPrev.click();
    currentSlideId--;
  }
}

/*
 * 画像は常に表示で，更新はクリック時のみ
 * popup手法と違うのは，setIntervalしないだけ．
*/
function clickedKeyEvent(e) {
  if (e.code == 'Enter' || e.code == 'ArrowRight' || e.code == 'Space') {    
    buttonNext.click();
    if (currentSlideId > 0 && currentSlideId < maxSlideId) {
      updateImage(currentSlideId);
      currentSlideId++;
      i = (currentSlideId - 2) % scenario.length;
      j = 0;
      if (currentSlideId == 2) {
        clearInterval(scenarioIntervalId);
        scenarioIntervalId = setInterval(createReaction, interval[j]);
        console.log(`id = ${scenarioIntervalId}`);
      } else if (currentSlideId == maxSlideId) {
        clearInterval(scenarioIntervalId);
      }
    }
  } else if (e.code == 'ArrowLeft') {
    buttonPrev.click();
    if (currentSlideId > 1) {
      currentSlideId--;
    }
  }
}

/*
 * 更新はクリック時のみ，画像の表示はクリック直後3秒間
*/
function popupKeyEvent(e) {
  if (e.code == 'Enter' || e.code == 'ArrowRight' || e.code == 'Space') {    
    clearInterval(popupIntervalId); 
    buttonNext.click();
    if (currentSlideId > 0 && currentSlideId < maxSlideId) {
      createPopup(currentSlideId);
      currentSlideId++;
      i = (currentSlideId - 2) % scenario.length;
      j = 0;
      if (currentSlideId == 2) {
        clearInterval(scenarioIntervalId);
        scenarioIntervalId = setInterval(createReaction, interval[j]);
      } else if (currentSlideId == maxSlideId) {
        clearInterval(scenarioIntervalId);
      }
    }
  } else if (e.code == 'ArrowLeft') {
    buttonPrev.click();
    if (currentSlideId > 1) {
      currentSlideId--;
    }
  }
}

function updateImage(slideId) {
  Http.open("GET", `${nextSlideUrl}?slide_id=${slideId}`);
  Http.send();
}

function createPopup(slideId) {
  Http.open("GET", `${popupUrl}?slide_id=${slideId}`);
  Http.send();
  /* deletePopup()を4000ms後に実行 */
  popupIntervalId = setInterval(deletePopup, 4000/*ms*/);
}

function deletePopup() {
  $('#popup-true').html('');
  clearInterval(popupIntervalId);
}

let i = 0;
let j = 0;

let scenario;
let interval;
if (currentURL.includes("script_id=0")) {
  scenario = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
  ]
  interval = [500, 500, 500, 500, 500, 500, 500, 500, 500, 500];
} else {
  scenario = [
    [1, 1, 2, 1, 1, 2, 1, 1, 3, 1],
    [2, 2, 1, 2, 2, 1, 2, 2, 3, 2],
    [3, 3, 1, 3, 3, 1, 3, 3, 2, 3],
    [3, 3, 2, 3, 3, 2, 3, 3, 1, 3],
    [1, 1, 3, 1, 1, 3, 1, 1, 2, 1],
    [2, 2, 3, 2, 2, 3, 2, 2, 1, 2]
  ];
  interval = [500, 200, 2200, 200, 200, 2700, 200, 900, 200, 2700];
}

function appendImage() {
  let url = domain + "/user_reactions/new_image?reaction_id=";
  Http.open("GET", url + scenario[i][j]);
  Http.send();
  clearInterval(scenarioIntervalId);
  if (++j == scenario[i].length) {
    j = 0;
  }
  scenarioIntervalId = setInterval(appendImage, interval[j]*2);
}

function appendTwiceImage() {
  let url = domain + "/user_reactions/new_image?reaction_id=";
  Http.open("GET", url + scenario[i][j]);
  Http.send();
  clearInterval(scenarioIntervalId);
  if (++j == scenario[i].length) {
    j = 0;
  }
  scenarioIntervalId = setInterval(appendTwiceImage, interval[j]/2);
}

function createReaction() {
  let url = domain + "/user_reactions/create?reaction_id=";
  Http.open("GET", url + scenario[i][j] + "&slide_id=" + currentSlideId);
  Http.send();
  clearInterval(scenarioIntervalId);
  if (++j == scenario[i].length) {
    j = 0;
  }
  scenarioIntervalId = setInterval(createReaction, interval[j]*2);
}