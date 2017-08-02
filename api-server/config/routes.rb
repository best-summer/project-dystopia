Rails.application.routes.draw do
  resources :items
  # get 'items/index' to
  #
  # get 'items/show'
  #
  # get 'items/create'
  #
  # get 'items/update'
  #
  # get 'items/destroy'


  resources :users
  post '/signup', to: 'users#create'
  patch '/status', to: 'users#update'
  delete '/logout',  to: 'sessions#destroy'
  get '/users/:name/status',  to: 'users#show'
  patch '/users/:name/status',  to: 'users#update'
  get '/users/:name/items',  to: 'items#show'
  post '/users/:name/items',  to: 'items#create'

  get 'users/index'
  # post 'users/create'
  # get 'users/show'
  # patch 'users/update'
  # delete 'users/destroy'
end
