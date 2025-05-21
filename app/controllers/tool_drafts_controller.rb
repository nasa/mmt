# :nodoc:
class ToolDraftsController < BaseDraftsController
  include ControlledKeywords
  include Cmr::Util
  before_action :umm_t_enabled?

  before_action :set_schema, only: [:new, :create, :edit, :update, :show]
  before_action :set_form, only: [:edit, :update, :show]
  before_action :set_current_form, only: [:edit]
  before_action :set_preview, only: [:show]
  before_action :set_react_token, only: [:new, :create, :edit, :update, :show]

  def edit
    super
    set_tool_keywords if @current_form == 'descriptive_keywords'
  end

  private

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

  def set_schema
    @schema = JsonSchemaForm::UmmJsonSchema.new(plural_published_resource_name, 'umm-t-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = JsonSchemaForm::UmmJsonForm.new(
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
    @preview = JsonSchemaForm::UmmPreview.new(
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
