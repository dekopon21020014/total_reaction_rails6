class UserReactionsController < ApplicationController
  def new
    @user_reaction = UserReaction.new
    @reactions     = Reaction.all
  end

  def index
    @user_reactions = UserReaction.all
    @reactions      = Reaction.all
  end

  def create
    @user_reaction = UserReaction.new
    @user_reaction.reaction_id = params[:reaction_id].to_i
    if @user_reaction.save
      redirect_to new_user_reaction_path
    else
      render :new
    end
  end

  def user_reaction_params
    params.require(:user_reaction).permit(:reaction_id)
  end
end
