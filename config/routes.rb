Rails.application.routes.draw do
  root 'conversations#index'

  post "identity_tokens" => "identity_tokens#create"

  get "not_signed_in" => "pages#not_signed_in"

  resources :sessions, only: :create
end
