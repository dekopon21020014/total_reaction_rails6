class ReactionChannel < ApplicationCable::Channel
  def subscribed
    stream_from "reaction_channel_#{params['room_id']}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def send_reaction(data)
    UserReaction.create(
      reaction_id: data['reaction'] # keyは多分name属性
    )

    # 部分テンプレートをWebSocket経由で送り出す。
    # render_messageで部分テンプレートに文字を埋め込みmessageとして送り出している。
    # channnel_2が発表者側のグラフ表示の方
    ActionCable.server.broadcast "reaction_channel_2", {reaction: render_reaction(data)}
  end

  private

  def render_reaction(data)
    # renderではなくrenderer
    # rendererは、コントローラの制約を受けずに任意のビューテンプレートをレンダリング
    ApplicationController.renderer.render(partial: 'user_reactions/reaction', locals: {reactions: Reaction.all})
  end
end
