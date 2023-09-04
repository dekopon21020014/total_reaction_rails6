class UserReactionsController < ApplicationController
  def new
    @reactions = Reaction.all
    @user_reaction = UserReaction.new
  end

  def index
    @user_reactions = UserReaction.all
  end

  def create
    @user_reaction = UserReaction.new
    @user_reaction.user_id = params[:user_id].to_i
    @user_reaction.reaction_id = params[:reaction_id].to_i
    if @user_reaction.save
      ActionCable.server.broadcast 'reaction_channel', {content: @user_reaction}
      # redirect_to new_user_reaction_path
    else
      render :new
    end
  end

  def user_reaction_params
    params.require(:user_reaction).permit(:user_id, :reaction_id)
  end
end
