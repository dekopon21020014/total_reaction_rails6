Rails.application.routes.draw do
  root to: 'user_reactions#new'
  resources :reactions, only: [:new, :index, :show, :edit, :create, :destroy, :update, :destroy]
  resources :user_reactions, only: [:new, :index]
  get '/user_reactions/create', as: 'create_user_reaction' # createをpostではなくgetにする(処理が楽だから)
  get '/user_reactions/image', as: 'image_user_reaction'
  get '/user_reactions/new_image'
  get '/user_reactions/tmp'
  get '/user_reactions/swiper'
  get '/user_reactions/next_slide'
  get '/user_reactions/popup'
end
