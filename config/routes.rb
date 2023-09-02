Rails.application.routes.draw do
  root to: 'user_reactions#new'
  resources :reactions, only: [:new, :index, :show, :edit, :create, :destroy, :update, :destroy]
  resources :user_reactions, only: [:new, :index]
  get '/user_reactions/create', as: 'create_user_reaction'

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
