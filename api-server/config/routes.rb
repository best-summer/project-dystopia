Rails.application.routes.draw do
  get 'items/index'

  get 'items/show'

  get 'items/create'

  get 'items/update'

  get 'items/destroy'



  resources :users
  post '/signup', to: 'users#create'
  patch '/status', to: 'users#update_show'
  delete '/logout',  to: 'sessions#destroy'
  patch '/signup', to: 'users#update'
  get '/users/:name/status',  to: 'users#show'
  patch '/users/:name/status',  to: 'users#update_show'



  get 'users/index'
  # post 'users/create'
  # get 'users/show'
  # patch 'users/update'
  # delete 'users/destroy'


end
