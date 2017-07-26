Rails.application.routes.draw do
  get 'users/index'
  post 'users/create'
  get 'users/show'
  patch 'users/update'
  delete 'users/destroy'
  resources :users

end
