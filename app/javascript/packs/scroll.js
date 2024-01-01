var jscrollOption = {
    loadingHtml: '読み込み中・・・', //記事読み込み中の表示
    autoTrigger: true, // 自動で読み込むか否か、trueで自動、falseでボタンクリックとなる。
    padding: 20, // 指定したコンテンツの下から何pxで読み込むかを指定(autoTrigger: trueの場合のみ)
    contentSelector: '.jscroll' // 読み込む範囲の指定
};
$('.jscroll').jscroll(jscrollOption);