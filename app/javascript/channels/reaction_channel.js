import consumer from "./consumer"
/*
consumer.subscriptions.create("ReactionChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    const html = `<p>${data.content.text}</p>`;
    const messages = document.getElementsByClassName('reactions');
    const newMessage = document.getElementById('message_text');
    messages.insertAdjacentHTML('afterbegin', html);
    newMessage.value='';
  }
});
*/


$(document).on('turbolinks:load', function () {

  const reactions = $('#reactions') // reactionsのエレメント

  // ルームIDを#reactions内のdata-room-idから取得し、
  // chats_channel.rbでも使えるようにする
  const room = consumer.subscriptions.create(
      {channel: "ReactionChannel", room_id: reactions.data('room_id')}, {

          connected() {
              // 未使用
          },

          disconnected() {
              // 未使用
          },

          received(data) {
              // 受け取ったデータを追加する
              //  dataには、reactions_channel.rbから送られるパラメーター名に
              //  部分テンプレートに文字が埋め込まれているものが送られてくるので
              //  配列からmessageを抜き出し追加している。
              console.log(data);
              // reactions.append(data['reaction'])
              reactions.html('<div>こんなになっちゃった</div>')
          },

          send_reaction: function (reaction) {
              return this.perform('send_reaction', {reaction: reaction})
          }
      });

  // 入力フォームの制御
  $(document).ready(function () {
      // 入力エリアのエレメント
      const buttonElement = $('#reaction')
      // 入力エリアのEnterKey検出
      buttonElement.click(function (event) {
              // send_reactionを呼び出し
              room.send_reaction(buttonElement.val());
              event.preventDefault();
      })
  })
})
