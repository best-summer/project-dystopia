Rails.application.routes.draw do
  # get 'items/index'
  #
  # get 'items/show'
  #
  # get 'items/create'
  #
  # get 'items/update'
  #
  # get 'items/destroy'

  post '/signup', to: 'users#create'
  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'

  get 'users/index'
  post 'users/create'
  get 'users/show'
  patch 'users/update'
  delete 'users/destroy'
  resources :users do
    resource :items
  end

end
