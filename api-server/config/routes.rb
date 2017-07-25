Rails.application.routes.draw do
  get 'users/index'

  post 'users/create'

  get 'users/show'

  patch 'users/update'

  delete 'users/destroy'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
