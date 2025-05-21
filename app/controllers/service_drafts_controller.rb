# :nodoc:
class ServiceDraftsController < BaseDraftsController
  include ControlledKeywords
  before_action :umm_s_enabled?
  include Cmr::Util


  before_action :set_resource, only: [:show, :edit, :update, :destroy]
  before_action :ensure_published_record_supported_version, only: [:show, :edit]
  before_action :set_schema, only: [:show, :new, :edit, :update, :create]
  before_action :set_form, only: [:show, :edit, :update]
  before_action :set_current_form, only: [:edit]
  before_action :set_preview, only: [:show]
  before_action :set_react_token, only: [:new, :create, :edit, :update, :show]

  def edit
    super
    set_service_keywords if @current_form == 'descriptive_keywords'
  end

  private

  def set_schema
    @schema = JsonSchemaForm::UmmJsonSchema.new(plural_published_resource_name, 'umm-s-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = JsonSchemaForm::UmmJsonForm.new(
      plural_published_resource_name,
      'umm-s-form.json',
      @schema,
      get_resource.draft,
      field_prefix: 'service_draft/draft',
      draft_id: get_resource.id
    )
  end

  def set_preview
    @preview = JsonSchemaForm::UmmPreview.new(
      schema_type: published_resource_name,
      preview_filename: 'umm-s-preview.json',
      data: get_resource.draft,
      draft_id: get_resource.id
    )
  end

  def set_current_form
    @current_form = params[:form] || @json_form.forms.first.parsed_json['id']
  end

  def service_draft_params
    # Allow for completely empty forms to be saved
    return {} unless params.key?(:service_draft)

    # If the form isn't empty, only permit whitelisted attributes
    permitted = params.require(:service_draft).permit(:draft_type).tap do |whitelisted|
      # Allows for any nested key within the draft hash
      whitelisted[:draft] = params[:service_draft][:draft]
    end
    permitted.to_unsafe_h # need to understand what this is doing more, think related to nested parameters not permitted.
  end

  def prefix_token(token)
    new_token = token
    if is_urs_token?(token)
      new_token = "Bearer #{token}"
    end
    new_token
  end

  def set_react_token
    @react_token = prefix_token(token)
    @react_user = current_user.urs_uid
    @react_provider = current_user.provider_id
  end
end
