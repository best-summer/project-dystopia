Rails.application.routes.draw do
  # get 'items/index'
  # get 'items/show'
  # get 'items/create'
  # get 'items/update'
  # get 'items/destroy'

  resources :users
  post '/signup', to: 'users#create'
  delete '/logout',  to: 'sessions#destroy'

  get 'users/index'
  # post 'users/create'
  # get 'users/show'
  # patch 'users/update'
  # delete 'users/destroy'


end
