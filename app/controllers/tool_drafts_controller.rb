# :nodoc:
class ToolDraftsController < BaseDraftsController
  include ControlledKeywords
  before_action :umm_t_enabled?

  before_action :set_schema, only: [:new, :create, :edit, :update, :show]
  before_action :set_form, only: [:edit, :update, :show]
  before_action :set_current_form, only: [:edit]
  before_action :set_preview, only: [:show]
  before_action :set_resource, only: [:download_json]
  before_action :proposal_approver_permissions, except: [:download_json]
  skip_before_action :ensure_user_is_logged_in, only: [:download_json]

  def edit
    super

    set_tool_keywords if @current_form == 'descriptive_keywords'
  end

  def download_json
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

  private

  def set_schema
    @schema = UmmJsonSchema.new(plural_published_resource_name, 'umm-t-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = UmmJsonForm.new(
      plural_published_resource_name,
      'umm-t-form.json',
      @schema,
      get_resource.draft,
      field_prefix: 'tool_draft/draft',
      draft_id: get_resource.id
    )
  end

  def set_current_form
    @current_form = params[:form] || @json_form.forms.first.parsed_json['id']
  end

  def set_preview
    @preview = UmmPreview.new(
      schema_type: published_resource_name,
      preview_filename: 'umm-t-preview.json',
      data: get_resource.draft,
      draft_id: get_resource.id
    )
  end

  def tool_draft_params
    # Allow for completely empty forms to be saved
    return {} unless params.key?(:tool_draft)

    # If the form isn't empty, only permit whitelisted attributes
    permitted = params.require(:tool_draft).permit(:draft_type).tap do |whitelisted|
      # Allows for any nested key within the draft hash
      # TODO: we should find a way to run through the schema and only whitelist
      # keys that exist in the schema.
      whitelisted[:draft] = params[:tool_draft][:draft].permit!
    end

    permitted.to_h
  end
end
