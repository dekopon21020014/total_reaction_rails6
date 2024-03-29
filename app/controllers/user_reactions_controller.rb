class UserReactionsController < ApplicationController
  def new
    @user_reaction  = UserReaction.new
    @reactions      = Reaction.all
    @user_reactions = UserReaction.all
  end

  def index # 結局これは使わない
    to   = Time.current # config/application.rbの設定のタイムゾーンに応じた現在時刻を取得
    from = to - (3600 * 1.5) # 現在時刻から90分前
    @reactions = Reaction.all
    @user_reactions_90min = UserReaction.where("created_at BETWEEN ? AND ?", from, to)

    # 折れ線グラフのためのデータ
    @data_for_line_chart = @reactions.map { |reaction|
      {name: reaction.name, data: reaction.user_reactions.where("created_at BETWEEN ? AND ?", from, to).group_by_minute(:created_at).count}
    }
    # 棒グラフのためのデータ
    @data_for_column_chart = @reactions.map { |reaction| 
      [reaction.name, reaction.user_reactions.where("created_at BETWEEN ? AND ?", from, to).count]
    }
    # 90分間で何回リアクションあったかをviewで表示したい
    @count_of_reaction_90min = @reactions.map { |reaction|
      {name: reaction.name, count: reaction.user_reactions.where("created_at BETWEEN ? AND ?", from, to).count}
    }
  end

  def create # こいつも使ってない
    user_reaction = UserReaction.new(
      reaction_id: params[:reaction_id],
      slide_id:    params[:slide_id]
    )
    user_reaction.save  
  end

  def image
	  @reactions = Reaction.all
  end

  def tmp
    @reactions = Reaction.all
  end

  def swiper
    @slides = Slide.where(script_id: params[:script_id])
    unless @slides
      @slides = Slide.all
    end
  end

  def new_image
    new_reaction = UserReaction.new(
      reaction_id: params[:reaction_id],
      slide_id:    params[:slide_id]
    )
    path = Rails.application.routes.url_helpers.rails_blob_path(new_reaction.reaction.image, only_path: true)
    ActionCable.server.broadcast "reaction_channel_image", {user_reactions_image: render_image(params[:slide_id]), image_path: path}
  end

  # nest_slideアクションと，popupアクションはやっていることは全く同じ
  # 異なるのは，ブロードキャストする時のキーのみ
  # これ一個にまとめられるのでは？
  def next_slide
    ActionCable.server.broadcast "reaction_channel_image", {clicked_true: render_image(params[:slide_id])}
  end

  def popup
    ActionCable.server.broadcast "reaction_channel_image", {popup_true: render_image(params[:slide_id])}
  end

  def traditional
    # ActionCable.server.broadcast "reaction_channel_image", {traditional_true: render_image}
  end

  private
  def user_reaction_params
    params.require(:user_reaction).permit(:reaction_id)
  end

  def render_image(slide_id)
    # reaction?channel.rbからコピペしたからコメントはそっちに記述した
    reactions = Reaction.all
    renderer = ApplicationController.renderer.new(
      http_host: ENV['HTTP_HOST'] + ":" + ENV['PORT']
      #,https: false
    )
    renderer.render(partial: 'user_reactions/images', 
                    locals: {
                      reactions: reactions,
                      slide_id:  slide_id,
                    }
                  )
  end
end
