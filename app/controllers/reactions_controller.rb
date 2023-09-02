class ReactionsController < ApplicationController
  def new
    @reaction = Reaction.new
  end

  def index
    @reactions = Reaction.all
  end

  def create
    @reaction = Reaction.new(reaction_params)
    if @reaction.save
      redirect_to new_reaction_path
    else
      render :new
    end
  end

  def show
    @reaction = Reaction.find(params[:id])
  end

  def edit
    @reaction = Reaction.find(params[:id])
  end

  def update
    @reaction = Reaction.find(params[:id])
    if @reaction.update(reaction_params)
      redirect_to reactions_path
    else
      render :edit
    end
  end

  def reaction_params
    params.require(:reaction).permit(:name)
  end
end
