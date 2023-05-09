class Api::DraftsController < BaseDraftsController
  include ManageMetadataHelper

  protect_from_forgery with: :null_session
  before_action :proposal_approver_permissions, except: [:index, :create, :show, :update, :publish, :destroy]
  before_action :set_resource, only: [:show, :update, :publish, :destroy]
  before_action :validate_token, only: [:index, :create, :show, :update, :publish, :destroy]
  skip_before_action :ensure_user_is_logged_in, only: [:index, :create, :show, :update, :publish, :destroy]
  skip_before_action :add_top_level_breadcrumbs, only: [:index, :create, :show, :update, :publish, :destroy]

  def set_resource(resource = nil)
    begin
      resource ||= resource_class.find(params[:id])
      instance_variable_set("@#{resource_name}", resource)
    rescue ActiveRecord::RecordNotFound
      render json: JSON.generate({'error': "Couldn't find #{resource_name} with 'id'=#{params[:id]}"}), status: 404
    end
  end

  def index
    provider_id = request.headers["Provider"]
    resources = resource_class.where(provider_id: provider_id).order('updated_at DESC')
    response.set_header('MMT_Hits', "#{resources.count}")
    render json: resources, status: 200
  end

  def create
    provider_id = request.headers["Provider"]
    user = User.find_or_create_by(urs_uid: request.headers["User"])
    set_resource(resource_class.new(provider_id: provider_id, user: user, draft: {}))

    json_params = JSON.parse(request.body.read())
    json_params = JSON.parse(json_params) unless json_params.is_a?(Hash)
    json_params_to_resource(json_params: json_params)
    if get_resource.save
      Rails.logger.info("Audit Log: #{user.urs_uid} successfully created #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{provider_id}")
      render json: draft_json_result, status: 200
    else
      errors_list = generate_model_error
      Rails.logger.info("Audit Log: #{user.urs_uid} could not create #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{provider_id} because of #{errors_list}")
      render json: JSON.generate({'error': 'Could not create draft'}), status: 500
    end
  end

  def update
    begin
      provider_id = request.headers["Provider"]
      user = User.find_or_create_by(urs_uid: request.headers["User"])
      json_params = JSON.parse(request.body.read())
      json_params = JSON.parse(json_params) unless json_params.is_a?(Hash)
      json_params_to_resource(json_params: json_params)
      get_resource.save
      Rails.logger.info("Audit Log: #{user.urs_uid} successfully updated #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{provider_id}")
      render json: draft_json_result, status: 200
    rescue => e
      Rails.logger.info("Audit Log: #{user.urs_uid} could not update #{resource_name.titleize} with id: #{params[:id]} for provider: #{provider_id} because of #{e.inspect}")
      render json: JSON.generate({'error': "Could not update draft: #{e.message}"}), status: 500
    end
  end

  def destroy
    begin
      provider_id = request.headers["Provider"]
      user = User.find_or_create_by(urs_uid: request.headers["User"])
      get_resource.destroy
      Rails.logger.info("Audit Log: #{resource_name.titleize} #{get_resource.entry_title} was destroyed by #{user.urs_uid} in provider: #{provider_id}")
      render json: JSON.generate({'result': 'Draft deleted'}), status: 200
    rescue  => e
      Rails.logger.info("Audit Log: #{user.urs_uid} could not delete #{resource_name.titleize} with id: #{params[:id]} for provider: #{provider_id} because of #{e.inspect}")
      render json: JSON.generate({'error': "Could not delete draft: #{e.message}"}), status: 500
    end
  end

  def publish
    provider_id = request.headers["Provider"]
    user = User.find_or_create_by(urs_uid: request.headers["User"])
    json_params = JSON.parse(request.body.read())
    json_params = JSON.parse(json_params) unless json_params.is_a?(Hash)
    json_params_to_resource(json_params: json_params)

    if get_resource.save
      ingested_response = {}
      if params[:draft_type] == 'ToolDraft'
        ingested_response = cmr_client.ingest_tool(metadata: get_resource.draft.to_json, provider_id: get_resource.provider_id, native_id: get_resource.native_id, token: @token)
      elsif params[:draft_type] == 'VariableDraft'
        render json: draft_json_result(errors: ['Associated Collection Concept ID is required.']), status: 400 and return unless get_resource.collection_concept_id
        
        ingested_response = cmr_client.ingest_variable(metadata: get_resource.draft.to_json, collection_concept_id: get_resource.collection_concept_id, native_id: get_resource.native_id, token: @token)
      end
      if ingested_response.success?
        # get information for publication email notification before draft is deleted
        Rails.logger.info("Audit Log: #{resource_name.capitalize} with title #{get_resource.entry_title} and id: #{get_resource.id} was published by #{user.urs_uid} for provider: #{user.provider_id}")
        short_name = get_resource.draft['short_name']
        # Delete draft
        get_resource.destroy

        concept_id = ingested_response.body['concept-id']
        revision_id = ingested_response.body['revision-id']

        begin
          # instantiate and deliver notification email
          DraftMailer.send("#{params[:draft_type].underscore}_published_notification", get_user_info, concept_id, revision_id, short_name).deliver_now
        rescue => e
          Rails.logger.error "Error trying to send email in #{self.class} Error: #{e}"
        end

        result = ingested_response.body
        render json: draft_json_result(concept_id: result.dig('concept-id'), revision_id: result.dig('revision-id') ), status: 200

      else
        Rails.logger.error("Ingest #{resource_name.capitalize} Metadata Error: #{ingested_response.clean_inspect}")
        Rails.logger.info("User #{user.urs_uid} attempted to ingest #{resource_name} draft #{get_resource.entry_title} in provider #{user.provider_id} but encountered an error.")
        render json: draft_json_result(errors: ingested_response.errors), status: 500
      end
    else
      errors_list = generate_model_error
      Rails.logger.info("Audit Log: #{user.urs_uid} could not update #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{provider_id} because of #{errors_list}")
      render json: JSON.generate({'error': 'Could not update draft'}), status: 500
    end
  end

  def show
    render json: draft_json_result
  end

  def validate_token
    if Rails.env.development?
      @token = 'token'
      return
    end

    authorization_header = request.headers['Authorization']
    user_id = request.headers['User']

    if authorization_header.nil?
      render json: JSON.pretty_generate({'error': 'unauthorized'}), status: 401
      return
    end
    @token = authorization_header

    # Handle EDL authentication
    if authorization_header.start_with?('Bearer')
      @token = authorization_header.split(' ', 2)[1] || ''
      if Rails.configuration.proposal_mode
        token_response = cmr_client.validate_dmmt_token(@token)
      else
        token_response = cmr_client.validate_mmt_token(@token)
      end
      token_info = token_response.body
      token_info = JSON.parse token_info if token_info.class == String # for some reason the mock isn't return hash but json string.
      urs_uid = token_info['uid']
    else
      # Handle Launchpad authentication
      token_response = cmr_client.validate_launchpad_token(@token)
      urs_uid = nil
      if token_response.success?
        auid = token_response.body.fetch('auid', nil)
        @urs_profile_response = cmr_client.get_urs_uid_from_nams_auid(auid)

        urs_uid = @urs_profile_response.body.fetch('uid', '') if @urs_profile_response.success?
      end
    end

    # If we don't have a urs_uid, exit out with unauthorized
    if urs_uid.nil? || (urs_uid != user_id)
      render json: JSON.pretty_generate({ "error": 'unauthorized' }), status: 401
      return
    end

    authorized = false

    if token_response.success?
      token_user = User.find_by(urs_uid: urs_uid) # the user assoc with the token

      unless token_user.nil?
        # For drafts, users have access to any drafts in their provider list
        # Verify the user has permissions for this provider
        provider_id = request.headers["Provider"]
        provider_id = get_resource.provider_id unless get_resource.nil?
        authorized = true if token_user.available_providers.include? provider_id
      end
    end

    render json: JSON.pretty_generate({"error": 'unauthorized'}), status: 401 unless authorized
  end

  def remove_empty(hash_to_clean)
    hash_to_clean.compact_blank
    hash_to_clean.each do |key, value|
      if value.kind_of?(Array)
        all_empty = true
        value.each do |sub_value|
          unless sub_value.blank?
            all_empty = false
            break
          end
        end
        hash_to_clean.delete(key) if all_empty
      end
      if value.kind_of?(Hash)
        remove_empty(value)
      end
    end
    hash_to_clean.compact_blank
  end

  def json_params_to_resource(json_params: {})
    if json_params['draft'].blank?
      json_params['draft'] = {}
    end
    json_params['draft'] = remove_empty(json_params['draft']) unless json_params.blank? || json_params['draft'].blank?
    get_resource.draft = json_params['draft']
    get_resource.collection_concept_id = json_params['associatedCollectionId']
  end

  def draft_json_result(errors: {}, concept_id: nil, revision_id: nil)
    json = {}
    json['id'] = get_resource.id
    json['draft'] = get_resource.draft
    json['user_id'] = get_resource.user_id
    json['errors'] = errors
    json['concept_id'] = concept_id
    json['revision_id'] = revision_id
    json['collection_concept_id'] = get_resource.collection_concept_id
    JSON.pretty_generate(json)
  end

  # The singular name for the resource class based on the draft_type
  # @return [String]
  def resource_name
      @resource_name ||= params[:draft_type]
  end
  helper_method :resource_name

end
