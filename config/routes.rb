Rails.application.routes.draw do
  resources :provider_holdings, only: [:index, :show]

  # PUMPness
  resources :permissions
  get '/permission/all_collections' => 'permissions#get_all_collections'

  resources :system_identity_permissions, only: [:index, :edit, :update]
  resources :provider_identity_permissions, only: [:index, :edit, :update]

  resource :order_policies, except: :show

  resources :order_options
  post '/order_options/:id/deprecate' => 'order_options#deprecate', as: 'order_option_deprecate'

  get '/order_policies' => 'order_policies#index'
  post '/order_policies/test_endpoint_connection' => 'order_policies#test_endpoint_connection'

  resource :order_option_assignments, only: [:edit, :destroy]
  resources :order_option_assignments, except: :edit
  post '/order_option_assignments/edit' => 'order_option_assignments#edit'

  resources :data_quality_summaries

  resource :data_quality_summary_assignments, except: :show
  get '/data_quality_summary_assignments' => 'data_quality_summary_assignments#index'

  resources :service_entries
  resources :service_options
  resource :service_option_assignments, except: :show
  get '/service_option_assignments' => 'service_option_assignments#index'

  resources :orders do
    collection do
      put 'search'
    end
  end
  resources :provider_orders, only: [:show, :edit, :destroy] do
    member do
      post 'resubmit'
    end
  end

  resources :groups
  post '/invite_user' => 'groups#invite', as: 'invite_user'
  get '/accept_invite/:token' => 'groups#accept_invite', as: 'accept_invite'

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
  # get 'welcome/collections/:provider_id' => 'welcome#collections', as: 'data_provider_collections'

  get 'search' => 'search#index', as: 'search'

  # TODO: Create a manage_metadata controller like the manage_cmr controller below
  get 'manage_metadata' => 'pages#manage_metadata', as: 'manage_metadata'

  resource :manage_cmr, only: :show, controller: 'manage_cmr'

  # API Endpoints for Chooser implementations
  get 'provider_collections' => 'manage_cmr#provider_collections'
  get 'service_implementations_with_datasets' => 'manage_cmr#service_implementations_with_datasets'
  get 'datasets_for_service_implementation' => 'manage_cmr#datasets_for_service_implementation'

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
  get 'index-permissions' => 'pages#index-permissions', as: 'index-permissions'
  get 'new-permissions' => 'pages#new-permissions', as: 'new-permissions'
  get 'show-permissions' => 'pages#show-permissions', as: 'show-permissions'

  root 'welcome#index'
end
