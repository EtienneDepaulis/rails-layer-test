Rails.application.routes.draw do
  root 'users#index'
  post "identity_tokens" => "identity_tokens#create"
end
