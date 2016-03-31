Rails.application.routes.draw do
  resources :groups
  delete '/groups/:id/remove_members' => 'groups#remove_members', as: 'remove_members'
  post '/invite_user' => 'groups#invite', as: 'invite_user'

  resources :collections, only: [:show, :edit, :destroy]
  get '/collections/:id/revisions' => 'collections#revisions', as: 'collection_revisions'
  get '/collections/:id/revert/:revision_id' => 'collections#revert', as: 'revert_collection'
  get '/collections/:id/clone' => 'collections#clone', as: 'clone_collection'

  resources :drafts do
    get 'edit/:form' => 'drafts#edit', as: 'edit_form'
    post 'publish' => 'drafts#publish', as: 'publish'
    get 'download' => 'drafts#download_xml', as: 'download'
  end
  get 'subregion_options' => 'drafts#subregion_options'

  get 'welcome/index'
  get 'welcome/collections'

  get 'search' => 'search#index', as: 'search'

  get 'dashboard' => 'pages#dashboard', as: 'dashboard'
  get 'manage_cmr' => 'pages#manage_cmr', as: 'manage_cmr'
  get 'new_record' => 'pages#new_record', as: 'new_record'
  post 'hide_notification' => 'pages#hide_notification', as: 'hide_notification'

  get 'login' => 'users#login', as: 'login'
  get 'logout' => 'users#logout'
  get 'urs_callback' => 'oauth_tokens#urs_callback'

  post 'convert' => 'conversions#convert'

  post 'set_provider' => 'users#set_provider', as: 'set_provider'
  get 'refresh_providers' => 'users#refresh_providers', as: 'refresh_user_providers'

  # Small, light weight check if the app is running
  get 'status' => 'welcome#status'

  # Temporary routes for Permission pages
  get 'permissions' => 'pages#permissions', as: 'permissions'
  get 'new-permissions' => 'pages#new-permissions', as: 'new-permissions'
  get 'show-permissions' => 'pages#show-permissions', as: 'show-permissions'

  root 'welcome#index'
end
