Rails.application.routes.draw do
  get 'results/show'

  get 'results/update'

  resources :items
  resources :users
  post '/signup', to: 'users#create'
  patch '/status', to: 'users#update'
  delete '/logout',  to: 'sessions#destroy'
  get '/users/:name/status',  to: 'users#show'
  patch '/users/:name/status',  to: 'users#update'
  get '/users/:name/items',  to: 'items#show'
  post '/users/:name/items',  to: 'items#create'
  patch '/users/:name/items',  to: 'items#update'
  get '/users/:name/results',  to: 'results#show'
  patch '/users/:name/results',  to: 'results#update'


end
