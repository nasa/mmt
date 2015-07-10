Rails.application.routes.draw do
  get 'welcome/index'
  get 'welcome/collections'

  get 'search' => 'search#index', as: 'search'

  get 'dashboard' => 'pages#dashboard', as: 'dashboard'
  get 'metadata-form' => 'pages#metadata_form', as: 'metadata-form'

  get "login" => 'users#login'
  get "logout" => 'users#logout'
  get 'urs_callback' => 'oauth_tokens#urs_callback'

  root 'welcome#index'
end
