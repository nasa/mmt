Rails.application.routes.draw do
  resources :provider_holdings, only: [:index, :show]

  # PUMPness
  resources :permissions

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

  resources :groups do
    collection do
      get 'urs_search'
    end
  end
  post '/invite_user' => 'groups#invite', as: 'invite_user'
  get '/accept_invite/:token' => 'groups#accept_invite', as: 'accept_invite'

  post '/bulk_updates/check_task_name' => 'bulk_updates#check_task_name'
  resources :bulk_updates, only: [:index, :show, :create] do
    collection do
      match 'new', via: [:get, :post], as: 'new'
    end
    # post 'preview' => 'bulk_updates#preview', as: 'preview'
  end
  post '/bulk_updates/preview' => 'bulk_updates#preview', as: 'bulk_update_preview'

  resource :bulk_updates_search, only: [:new]

  resources :collections, only: [:show, :edit, :destroy]
  get '/collections/:id/revisions' => 'collections#revisions', as: 'collection_revisions'
  get '/collections/:id/revert/:revision_id' => 'collections#revert', as: 'revert_collection'
  get '/collections/:id/clone' => 'collections#clone', as: 'clone_collection'
  get '/collections/:id/download_xml/:format(/:revision_id)' => 'collections#download_xml', as: 'download_collection_xml'

  resources :variables, only: [:show, :create, :edit, :destroy] do
    resources :collection_associations, only: [:index, :new, :create] do
      collection do
        match '/' => 'collection_associations#destroy', via: :delete
      end
    end
  end
  get '/variables/:id/revisions' => 'variables#revisions', as: 'variable_revisions'
  get '/variables/:id/revert/:revision_id' => 'variables#revert', as: 'revert_variable'
  get '/variables/:id/clone' => 'variables#clone', as: 'clone_variable'
  get '/variables/:id/download_json(/:revision_id)' => 'variables#download_json', as: 'download_json_variable'

  resources :services, only: [:show, :create, :edit, :destroy]

  resources :variable_drafts, controller: 'variable_drafts', draft_type: 'VariableDraft' do
    member do
      get 'edit', path: 'edit(/:form)'
    end
  end

  resources :service_drafts, controller: 'service_drafts', draft_type: 'ServiceDraft' do
    member do
      get 'edit', path: 'edit(/:form)'
    end
  end
  resources :collection_drafts, controller: 'collection_drafts', draft_type: 'CollectionDraft', as: 'collection_drafts' do
    member do
      get 'edit', path: 'edit(/:form)'
      get 'download'
      post 'publish'
    end
  end
  get 'subregion_options' => 'collection_drafts#subregion_options'

  get 'welcome/index'
  # MMT-867: Removing Provider Holdings from the 'homepage' for now as we need because it's
  # causing issues with load times but before we can solve that we need to discuss the implemntation
  # requirements going forward.
  # get 'welcome/collections/:provider_id' => 'welcome#collections', as: 'data_provider_collections'

  get 'search' => 'search#index', as: 'search'

  resource :manage_collections, only: :show
  resource :manage_variables, only: :show
  resource :manage_services, only: :show, controller: 'manage_services'
  resource :manage_cmr, only: :show, controller: 'manage_cmr'

  # API Endpoints for Chooser implementations
  get 'provider_collections' => 'manage_cmr#provider_collections'
  post 'provider_collections' => 'manage_cmr#provider_collections'

  get 'service_implementations_with_datasets' => 'manage_cmr#service_implementations_with_datasets'
  get 'datasets_for_service_implementation' => 'manage_cmr#datasets_for_service_implementation'

  get 'login' => 'users#login', as: 'login'
  get 'logout' => 'users#logout'
  get 'urs_callback' => 'oauth_tokens#urs_callback'
  get 'provider_context' => 'users#provider_context', as: 'provider_context'

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

  match '/404', to: 'errors#not_found', via: :all
  match '/500', to: 'errors#internal_server_error', via: :all
end
