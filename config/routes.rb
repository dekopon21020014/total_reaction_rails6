Rails.application.routes.draw do
  root to: 'user_reactions#new'
  resources :reactions, only: [:new, :index, :show, :edit, :create, :destroy, :update, :destroy]
  resources :user_reactions, only: [:new, :index]
  get '/user_reactions/create', as: 'create_user_reaction' # createをpostではなくgetにする(処理が楽だから)
  get '/user_reactions/image', as: 'image_user_reaction'   
end
