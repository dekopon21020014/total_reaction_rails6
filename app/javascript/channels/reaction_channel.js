import consumer from "./consumer"

$(document).on('turbolinks:load', function () {

  const reactionButtons = $('#reaction-buttons') // reactionsのエレメント
  const user_reactions_chart = $('#user_reactions_chart') // リアクションを表示しているグラフ
  const room = consumer.subscriptions.create(
      {channel: "ReactionChannel", room_id: reactionButtons.data('room_id')}, {

          connected() {
              // 未使用
          },

          disconnected() {
              // 未使用
          },

          received(data) {
              console.log(data);
              user_reactions_chart.html(data['reaction']);
          },

          send_reaction: function (reaction) {
              return this.perform('send_reaction', {reaction: reaction})
          }
      });

  // ボタン押下を見張る      
  $(document).ready(function () {
      const buttonElements = $('.btn'); // btnクラスの要素たち
      buttonElements.click(function (event) {
              const clickedButton = $(this); // btnのうちクリックされた要素
              room.send_reaction(clickedButton.val()); // value属性の値を取ってくる
              // event.preventDefault(); formとかを使うときにはこの記述が必要
      })
  })
})
