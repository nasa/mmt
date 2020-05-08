# :nodoc:
class ToolDraftsController < BaseDraftsController
  # include ControlledKeywords
  before_action :umm_t_enabled?

  before_action :set_schema, only: [:new, :create]

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
    # @current_form = params[:form] ||
    @current_form = @json_form.forms.first.parsed_json['id']
  end

  def tool_draft_params
    # Allow for completely empty forms to be saved
    return {} unless params.key?(:tool_draft)

    # If the form isn't empty, only permit whitelisted attributes
    permitted = params.require(:tool_draft).permit(:draft_type).tap do |whitelisted|
      # Allows for any nested key within the draft hash
      whitelisted[:draft] = params[:tool_draft][:draft]
    end

    # TODO: when working update ticket, investigate if we can use `.to_h` here
    permitted.to_unsafe_h # need to understand what this is doing more, think related to nested parameters not permitted.
  end
end
