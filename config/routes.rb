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

  resources :subscriptions
  post 'estimate_notifications' => 'subscriptions#estimate_notifications'

  post '/bulk_updates/check_task_name' => 'bulk_updates#check_task_name'
  resources :bulk_updates, only: [:index, :show, :create] do
    collection do
      match 'new', via: [:get, :post], as: 'new'
    end
    # post 'preview' => 'bulk_updates#preview', as: 'preview'
  end
  post '/bulk_updates/preview' => 'bulk_updates#preview', as: 'bulk_update_preview'

  resource :bulk_updates_search, only: [:new]

  resources :tags, only: [:index, :show], constraints: { id: /[^\/]+/ }

  resources :collections, only: [:show, :edit, :destroy]
  get '/collections/:id/revisions' => 'collections#revisions', as: 'collection_revisions'
  get '/collections/:id/revert/:revision_id' => 'collections#revert', as: 'revert_collection'
  get '/collections/:id/clone' => 'collections#clone', as: 'clone_collection'
  get '/collections/:id/download_xml/:format(/:revision_id)' => 'collections#download_xml', as: 'download_collection_xml'
  get '/collections/:id/create_delete_proposal' => 'collections#create_delete_proposal', as: 'create_delete_proposal_collection'
  get '/collections/:id/create_update_proposal' => 'collections#create_update_proposal', as: 'create_update_proposal_collection'
  get '/collections/:id/loss_report' => 'collections#loss_report', as: 'loss_report_collections'


  resource :variable_generation_processes_search, only: [:new]

  resource :variable_generation_process, only: [:create, :update] do
    member do
      match 'edit', action: :edit, via: [:put]
      match 'save_variable_drafts', action: :save_variable_drafts, via: [:post]
    end
  end

  resources :variables, only: [:show, :create, :edit, :destroy] do
    resources :collection_associations, only: [:index] do
      collection do
        match '/' => 'collection_associations#edit', via: :edit
        match '/' => 'collection_associations#update', via: :post
      end
    end
  end
  get '/variables/:id/collection_associations/edit' => 'collection_associations#edit', as: 'edit_variable_collection_association'
  get '/variables/:id/revisions' => 'variables#revisions', as: 'variable_revisions'
  get '/variables/:id/revert/:revision_id' => 'variables#revert', as: 'revert_variable'
  get '/variables/:id/clone' => 'variables#clone', as: 'clone_variable'
  get '/variables/:id/download_json(/:revision_id)' => 'variables#download_json', as: 'download_json_variable'

  resources :services, only: [:show, :create, :edit, :destroy] do
    resources :collection_associations, only: [:index, :new, :create] do
      collection do
        match '/' => 'collection_associations#destroy', via: :delete
      end
    end
  end
  get '/services/:id/revisions' => 'services#revisions', as: 'service_revisions'
  get '/services/:id/revert/:revision_id' => 'services#revert', as: 'revert_service'
  get '/services/:id/clone' => 'services#clone', as: 'clone_service'
  get '/services/:id/download_json(/:revision_id)' => 'services#download_json', as: 'download_json_service'

  resources :tools, only: [:show, :create, :edit, :destroy] do
    resources :collection_associations, only: [:index, :new, :create] do
      collection do
        match '/' => 'collection_associations#destroy', via: :delete
      end
    end
  end
  get '/tools/:id/clone' => 'tools#clone', as: 'clone_tool'
  get '/tools/:id/revisions' => 'tools#revisions', as: 'tool_revisions'
  get '/tools/:id/download_json(/:revision_id)' => 'tools#download_json', as: 'download_json_tool'
  get '/tools/:id/revert/:revision_id' => 'tools#revert', as: 'revert_tool'

  resources :variable_drafts, controller: 'variable_drafts', draft_type: 'VariableDraft' do
    member do
      get :edit, path: 'edit(/:form)'
      get '/collection_search' => 'variable_drafts_collection_searches#new', as: 'collection_search'
      post 'update_associated_collection'
    end
  end

  resources :service_drafts, controller: 'service_drafts', draft_type: 'ServiceDraft' do
    member do
      get :edit, path: 'edit(/:form)'
    end
  end

  resources :tool_drafts, controller: 'tool_drafts', draft_type: 'ToolDraft' do
    member do
      get :edit, path: 'edit(/:form)'
    end
  end

  resources :collection_drafts, controller: 'collection_drafts', draft_type: 'CollectionDraft', as: 'collection_drafts' do
    member do
      get :edit, path: 'edit(/:form)'
      get 'download'
      post 'publish'
      get 'check_cmr_validation'
    end
  end
  get 'subregion_options' => 'collection_drafts#subregion_options'
  get '/collection_drafts/:id/download_json' => 'collection_drafts#download_json'

  scope module: :proposal do
    get '/approved_proposals' => 'approved_proposals#approved_proposals', as: 'approved_proposals_approved_proposals'
    get '/approved_proposals/update_proposal_status' => 'approved_proposals#update_proposal_status', as: 'update_proposal_status_approved_proposals'
    get '/collection_draft_proposals/queued_index' => 'collection_draft_proposals#queued_index', as: 'queued_index_collection_draft_proposals'
    get '/collection_draft_proposals/in_work_index' => 'collection_draft_proposals#in_work_index', as: 'in_work_index_collection_draft_proposals'
    resource :manage_collection_proposals, only: :show
    resources :collection_draft_proposals, controller: 'collection_draft_proposals', draft_type: 'CollectionDraftProposal', as: 'collection_draft_proposals' do
      member do
        get :edit, path: 'edit(/:form)'
        get 'progress'
        get 'submit'
        get 'rescind'
        get 'approve'
        match 'reject', action: :reject, via: :put
      end
    end
    get 'proposal/subregion_options' => 'collection_draft_proposals#subregion_options'
    get '/collection_draft_proposals/:id/download_json' => 'collection_draft_proposals#download_json'

  end

  resources :collection_templates, controller: 'collection_templates', draft_type: 'CollectionTemplate', as: 'collection_templates' do
    member do
      get 'create_draft'
      get :edit, path: 'edit(/:form)'
    end
  end
  post '/collection_templates/new_from_existing' => 'collection_templates#new_from_existing', as: 'new_from_existing_collection_template'

  # MMT-867: Removing Provider Holdings from the 'homepage' for now as we need because it's
  # causing issues with load times but before we can solve that we need to discuss the implemntation
  # requirements going forward.
  # get 'welcome/collections/:provider_id' => 'welcome#collections', as: 'data_provider_collections'

  get 'search' => 'search#index', as: 'search'

  resource :manage_collections, only: :show
  post 'manage_collections/make_new_draft' => 'manage_collections#make_new_draft', as: 'make_new_draft_manage_collections'
  resource :manage_variables, only: :show, controller: 'manage_variables'
  resource :manage_services, only: :show, controller: 'manage_services'
  resource :manage_tools, only: :show, controller: 'manage_tools'
  resource :manage_cmr, only: :show, controller: 'manage_cmr'
  resource :manage_proposals, only: :show, controller: 'manage_proposal'
  post '/manage_proposal/publish_proposal' => 'manage_proposal#publish_proposal', as: 'publish_proposal_manage_proposal'

  # API Endpoints for Chooser implementations
  get 'provider_collections' => 'manage_cmr#provider_collections'
  post 'provider_collections' => 'manage_cmr#provider_collections'

  get 'service_implementations_with_datasets' => 'manage_cmr#service_implementations_with_datasets'
  get 'datasets_for_service_implementation' => 'manage_cmr#datasets_for_service_implementation'

  get 'login' => 'users#login', as: 'login'
  get 'logout' => 'users#logout'
  get 'launchpad' => 'users#login', defaults: { login_method: 'launchpad' }
  get 'prompt_urs_association' => 'users#prompt_urs_association'
  get 'confirm_urs_association' => 'users#confirm_urs_association'
  post 'associate_urs_and_launchpad_ids' => 'users#associate_urs_and_launchpad_ids'
  get 'urs_login_callback' => 'oauth_tokens#urs_login_callback'
  get 'urs_association_callback' => 'oauth_tokens#urs_association_callback'
  get 'provider_context' => 'users#provider_context', as: 'provider_context'

  # SAML login
  get 'saml/sso', to: 'saml#sso', as: :sso
  post 'saml/acs', to: 'saml#acs', as: :acs
  get 'saml/metadata', to: 'saml#metadata', as: :saml_metadata
  get 'saml/logout', to: 'saml#logout', as: :saml_logout

  get 'keep_alive', to: 'launchpad#keep_alive'

  post 'convert' => 'conversions#convert'

  post 'set_provider' => 'users#set_provider', as: 'set_provider'
  get 'refresh_providers' => 'users#refresh_providers', as: 'refresh_user_providers'

  post 'report_csp_violation' => 'csp#report_csp_violation', as: :report_csp_violation

  root 'welcome#index'

  match '/404', to: 'errors#not_found', via: :all
  match '/500', to: 'errors#internal_server_error', via: :all
end
