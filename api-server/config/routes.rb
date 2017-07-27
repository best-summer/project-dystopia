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

  get 'users/index'
  post 'users/create'
  get 'users/show'
  patch 'users/update'
  delete 'users/destroy'
  resources :users do
    resource :items
  end

end
