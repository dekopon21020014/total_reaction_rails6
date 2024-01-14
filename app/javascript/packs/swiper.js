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
let intervalId;
let currentSlideId = 1;

if (window.location.href.includes("traditional=true")) {
  addEventListener("keydown", traditionalKeyEvent);
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
    if (++currentSlideId == 2) {
      setInterval(appendImage, 1000);
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
      if (++currentSlideId == 2) {
        setInterval(createReaction, 1000);
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
    clearInterval(intervalId); 
    buttonNext.click();
    if (currentSlideId > 0 && currentSlideId < maxSlideId) {
      createPopup(currentSlideId);
      if (++currentSlideId == 2) {
        setInterval(createReaction, 1000);
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
  /* deletePopup()を3000ms後に実行 */
  intervalId = setInterval(deletePopup, 4000/*ms*/);
}

function deletePopup() {
  $('#popup-true').html('');
  clearInterval(intervalId);
}

let index = 0;
let scenario = [1, 2, 2, 1, 1, 1, 1, 1, 1, 3,
                2, 3, 3, 2, 2, 2, 2, 2, 2, 1,
                3, 1, 1, 3, 3, 3, 3, 3, 3, 3
               ];
[1121121131];
[1111111332];
[2222222113];
[2222222331];
[3333333112];
[3333333221];

function createReaction() {
  let url = domain + "/user_reactions/create?reaction_id=";
  Http.open("GET", url + scenario[index] + "&slide_id=" + currentSlideId);
  Http.send();
  index = ++index % scenario.length;
}

function appendImage() {
  let url = domain + "/user_reactions/new_image?reaction_id=";
  Http.open("GET", url + scenario[index]);
  Http.send();
  index = ++index % scenario.length; // 剰余は多分鈍足
}

/*
if (!window.location.href.includes("script_id=0")) {
  // setInterval(createReaction, 500);
} else if (currentSlideId == 17) {
  console.log("finished");
}

/*
*  以下の3つのURLで動きが変わるppはなくても一応大丈夫
*  http://localhost:3000/user_reactions/swiper?pp=disable
*  http://localhost:3000/user_reactions/swiper?pp=disable&popup=true
*  http://localhost:3000/user_reactions/swiper?pp=disable&clicked=true
*/


/* 
  if (traditional) {
    apppendImaeg();
  } else if (clicked_true){
    if (clicked) {
      update_image();
    }
  } else if (popup) {
    if (clicked) {
      popup_image();
    }
  }
*/