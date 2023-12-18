class ReactionChannel < ApplicationCable::Channel
  def subscribed
    stream_from "reaction_channel_#{params['channel_type']}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def send_reaction(reaction) 
    UserReaction.create(
      reaction_id: reaction['id'] # keyは多分name属性
    )

    # 部分テンプレートをWebSocket経由で送り出す。
    # reaction_channel.jsのrecievedで受け取る
    # channnel_2が発表者側のグラフ表示の方
    ActionCable.server.broadcast "reaction_channel_presenter", {user_reactions_chart: render_reaction(reaction)}
    ActionCable.server.broadcast "reaction_channel_image",     {user_reactions_image: render_image(reaction)}
  end

  private

  def render_reaction(data)
    to   = Time.current # config/application.rbの設定のタイムゾーンに応じた現在時刻を取得(config.time_zone = 'Tokyo')
    from = to - (3600 * 1.5)
    reactions = Reaction.all
    user_reactions_90min = UserReaction.where("created_at BETWEEN ? AND ?", from, to) # 90分前から現在までのデータを取得

    data_for_line_chart = reactions.map { |reaction|
      {name: reaction.name, data: reaction.user_reactions.where("created_at BETWEEN ? AND ?", from, to).group_by_minute(:created_at).count}
    }

    data_for_column_chart = reactions.map { |reaction| 
      [reaction.name, reaction.user_reactions.where("created_at BETWEEN ? AND ?", from, to).count]
    }

    count_of_reaction_90min = reactions.map { |reaction|
      {name: reaction.name, count: reaction.user_reactions.where("created_at BETWEEN ? AND ?", from, to).count}
    }

    # renderではなくrenderer
    # rendererは、コントローラの制約を受けずに任意のビューテンプレートをレンダリング
    ApplicationController.renderer.render(partial: 'user_reactions/reaction', 
                                          locals: {
                                            reactios:                reactions,
                                            user_reactions_90min:    user_reactions_90min,
                                            data_for_line_chart:     data_for_line_chart,
                                            data_for_column_chart:   data_for_column_chart,
                                            count_of_reaction_90min: count_of_reaction_90min
                                          })
  end

  def render_image(data)
    reactions = Reaction.all
    # この記述がないと，ApplicationController.rendererを使ってActiveStorageへのアクセスが失敗する
    # 具体的には<img>のsrc="http://example.com/...../hoge.png"みたいになる
    # http_hostに画像が保存されているホスト(とポート)を指定する
    # httpsはsslを有効化していないのにtrueにしておくと画像表示に失敗する
    # これをみた-> https://stackoverflow.com/questions/66515703/replace-example-org-when-generating-url-in-rails
    # こっちのConstantsも見た-> https://api.rubyonrails.org/v6.0.2.2/classes/ActionController/Renderer.html
    # globalで設定変更できないのか？2023.11.19
    # localhost:3000を指定すると他の端末からアクセスしたときに問題が生じる
    # my_addressはコンテナの
    renderer = ApplicationController.renderer.new(
      http_host: ENV['HTTP_HOST'] + ":" + ENV['PORT']
      #,https: false
    )

    #ApplicationController.renderer.render(partial: 'user_reactions/images', 
    renderer.render(partial: 'user_reactions/images', 
                                          locals: {
                                            reactions: reactions,
                                          })

  end

  def my_address # 自分のipアドレスを教えるメソッド
    require 'socket'
    udp = UDPSocket.new
    # クラスBの先頭アドレス,echoポート 実際にはパケットは送信されない。
    udp.connect("128.0.0.1", 7)
    adrs = Socket.unpack_sockaddr_in(udp.getsockname)[1]
    udp.close
    adrs
  end
end
# http://localhost:3000/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--3bfe818aacf4b11d70de754b5b5db8e8bd9e8fff/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVNOcEl3PT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--076bbc1e584c979ecd80a3d14fe7147a3a8ea00f/interesting.png
# http://localhost:3000/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--3bfe818aacf4b11d70de754b5b5db8e8bd9e8fff/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVI1cEhnPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--8f485caf05795e37e67bb37e57c2adeeb94d11e5/interesting.png
# http://example.org   /rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--3bfe818aacf4b11d70de754b5b5db8e8bd9e8fff/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVNOcEl3PT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--076bbc1e584c979ecd80a3d14fe7147a3a8ea00f/interesting.png
