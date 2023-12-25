import consumer from "./consumer"

$(document).on('turbolinks:load', function () {
    const reactionButtons    = $('#reaction-buttons')     // reactionsのエレメント
    const userReactionsChart = $('#user-reactions-chart') // リアクションを表示しているグラフ
    const userReactionsImage = $('#image')                /* 画像を塗り替える */
    const clickedTrue        = $('#clicked-true')
    const popupTrue          = $('#popup-true')

    const room = consumer.subscriptions.create(
        {
            channel:      "ReactionChannel", 
            channel_type: reactionButtons.data('channel_type')
        }, 
        {
            connected() {
                // 未使用
            },

            disconnected() {
                // 未使用
            },

            received(data) { // reaction_channnel.rbからboroadcastされたデータこの関数で受け取る
                userReactionsChart.html(data['user_reactions_chart']);
                userReactionsImage.html(data['user_reactions_image']);
                clickedTrue.html(data['clicked_true']);
                popupTrue.html(data['popup_true'])
            },

            send_reaction: function (reactionId) { // reaction_channel.rb#send_reactionを呼ぶ
                return this.perform('send_reaction', /* reaction = */ {id: reactionId})
            }
        }
    );

    // ボタン押下を見張る
    $(document).ready(function () {
        const buttonElements = $('.btn'); // btnクラスの要素たち
        buttonElements.click(function (event) {
            const clickedButton = $(this); // btnのうちクリックされた要素
            room.send_reaction(/*reactionId =*/clickedButton.val()); // value属性の値を上で定義されたsend_reactionに渡す
            // event.preventDefault(); formとかを使うときにはこの記述が必要
        })
    })
})
