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
    # render_messageで部分テンプレートに文字を埋め込みmessageとして送り出している。
    # channnel_2が発表者側のグラフ表示の方
    ActionCable.server.broadcast "reaction_channel_presenter", {user_reactions_chart: render_reaction(reaction)}
  end

  private

  def render_reaction(data)
    to   = Time.current # config/application.rbの設定のタイムゾーンに応じた現在時刻を取得
    from = to - (3600 * 1.5)
    reactions = Reaction.all
    user_reactions_90min = UserReaction.where("created_at BETWEEN ? AND ?", from, to)

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
end
