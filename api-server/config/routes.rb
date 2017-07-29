Rails.application.routes.draw do
  get 'items/index'

  get 'items/show'

  get 'items/create'

  get 'items/update'

  get 'items/destroy'



  resources :users
  post '/signup', to: 'users#create'
  get '/status',  to: 'users#index'
  delete '/logout',  to: 'sessions#destroy'
  patch '/signup', to: 'users#update'
  get '/users/:name/status',  to: 'users#show'



  get 'users/index'
  # post 'users/create'
  # get 'users/show'
  # patch 'users/update'
  # delete 'users/destroy'


end
