class Api::ToolDraftsController < ToolDraftsController
  include ManageMetadataHelper

  protect_from_forgery with: :null_session
  before_action :proposal_approver_permissions, except: [:create, :show]
  before_action :set_resource, only: [:show]
  skip_before_action :ensure_user_is_logged_in, only: [:create, :show]
  skip_before_action :set_form, only: [:show]
  skip_before_action :set_preview, only: [:show]

  def create
    provider_id = request.headers["Provider"]
    user = User.find_or_create_by(urs_uid: request.headers["User"])
    set_resource(resource_class.new(provider_id: provider_id, user: user, draft: {}))
    json_params = JSON.parse(request.body.read())
    get_resource.draft = json_params['draft']
    get_resource.save
  end

  def show
    if Rails.env.development?
      render json: JSON.pretty_generate(get_resource.draft) if Rails.env.development?
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
      render json: JSON.pretty_generate(get_resource.draft)
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
      render json: JSON.pretty_generate(get_resource.draft)
    else
      render json: JSON.pretty_generate({"error": 'unauthorized'}), status: 401
    end
  end
end