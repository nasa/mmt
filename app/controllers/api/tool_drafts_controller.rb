class Api::ToolDraftsController < ToolDraftsController
  include ManageMetadataHelper

  protect_from_forgery with: :null_session
  before_action :proposal_approver_permissions, except: [:create, :show, :update]
  before_action :set_resource, only: [:show, :update]
  skip_before_action :ensure_user_is_logged_in, only: [:create, :show, :update]
  skip_before_action :set_form, only: [:show, :update]
  skip_before_action :set_preview, only: [:show]

  def create
    provider_id = request.headers["Provider"]
    user = User.find_or_create_by(urs_uid: request.headers["User"])
    set_resource(resource_class.new(provider_id: provider_id, user: user, draft: {}))
    json_params = JSON.parse(request.body.read())
    if !json_params.is_a?(Hash)
      json_params = JSON.parse(json_params)
    end
    get_resource.draft = json_params
    if get_resource.save
      Rails.logger.info("Audit Log: #{user.urs_uid} successfully created #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{provider_id}")
      render json: JSON.pretty_generate(get_resource.id), status: 200
    else
      errors_list = generate_model_error
      Rails.logger.info("Audit Log: #{user.urs_uid} could not create #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{provider_id} because of #{errors_list}")
      render json: JSON.pretty_generate({'error': 'Could not create tool draft'}), status: 500
    end
  end

  def update
    provider_id = request.headers["Provider"]
    user = User.find_or_create_by(urs_uid: request.headers["User"])
    if get_resource.update(resource_params)
      Rails.logger.info("Audit Log: #{user.urs_uid} successfully updated #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{provider_id}")
      render json: JSON.pretty_generate(get_resource.id), status: 200
    else
      errors_list = generate_model_error
      Rails.logger.info("Audit Log: #{user.urs_uid} could not update #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{provider_id} because of #{errors_list}")
      render json: JSON.pretty_generate({'error': 'Could not update tool draft'}), status: 500
    end
  end

  def show
    if Rails.env.development?
      render json: draft_json_result if Rails.env.development?
      return
    end

    authorization_header = request.headers['Authorization']

    if authorization_header.nil?
      render json: JSON.pretty_generate({'error': 'unauthorized'}), status: 401
      return
    end
    token = authorization_header.split(' ', 2)[1] || ''

    # Handle EDL authentication
    if authorization_header.start_with?('Bearer')
      if Rails.configuration.proposal_mode
        token_response = cmr_client.validate_dmmt_token(token)
      else
        token_response = cmr_client.validate_mmt_token(token)
      end
      token_info = token_response.body
      token_info = JSON.parse token_info if token_info.class == String # for some reason the mock isn't return hash but json string.
      urs_uid = token_info['uid']
    else
      render json: JSON.pretty_generate(draft_json_result)
      return
      # Todo: We need to handle verifying a launchpad token.
      # # Handle Launchpad authentication
      # token_response = cmr_client.validate_launchpad_token(token)
      # urs_uid = nil
      # if token_response.success?
      #   auid = token_response.body.fetch('auid', nil)
      #   urs_profile_response = cmr_client.get_urs_uid_from_nams_auid(auid)
      #
      #   if urs_profile_response.success?
      #     urs_uid = @urs_profile_response.body.fetch('uid', '')
      #   end
      # end
    end

    # If we don't have a urs_uid, exit out with unauthorized
    if urs_uid.nil?
      render json: JSON.pretty_generate({ "error": 'unauthorized' }), status: 401
      return
    end

    authorized = false

    if token_response.success?
      token_user = User.find_by(urs_uid: urs_uid) # the user assoc with the token
      draft_user = User.find_by(id: get_resource.user_id) # the user assoc with the draft collection record

      unless token_user.nil?
        if Rails.configuration.proposal_mode
          # For proposals, users only have access to proposals created by them.
          # Verify the user owns the draft
          if token_user.urs_uid == draft_user.urs_uid
            authorized = true
          else
            if is_non_nasa_draft_approver?(user: token_user, token: token)
              authorized = true
            end
          end
        else
          # For drafts, users have access to any drafts in their provider list
          # Verify the user has permissions for this provider
          authorized = true if token_user.available_providers.include? get_resource.provider_id
        end
      end
    end

    if authorized
      render json: JSON.pretty_generate(draft_json_result)
    else
      render json: JSON.pretty_generate({"error": 'unauthorized'}), status: 401
    end
  end

  def draft_json_result
    json = {}
    json['id'] = get_resource.id
    json['draft'] = get_resource.draft
    json['user_id'] = get_resource.user_id
    JSON.pretty_generate(json)
  end
end