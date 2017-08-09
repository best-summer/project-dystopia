Rails.application.routes.draw do
  get 'results/show'

  get 'results/update'

  resources :items
  resources :users
  post '/signup', to: 'users#create'
  patch '/status', to: 'users#update'
  delete '/logout',  to: 'sessions#destroy'
  post '/gacha',  to: 'items#gacha'

  get '/users/:device_id/status',  to: 'users#show'
  patch '/users/:device_id/status',  to: 'users#update'
  get '/users/:device_id/items',  to: 'items#show'
  post '/users/:device_id/items',  to: 'items#create'
  patch '/users/:device_id/items',  to: 'items#update'
  get '/users/:device_id/results',  to: 'results#show'
  patch '/users/:device_id/results',  to: 'results#update'

end
