# :nodoc:
class ServiceDraftsController < BaseDraftsController
  include ControlledKeywords
  before_filter :umm_s_enabled?

  before_action :set_resource, only: [:show, :edit, :update, :destroy]
  before_action :set_schema, only: [:show, :new, :edit, :update, :create]
  before_action :set_form, only: [:show, :edit, :update]
  before_action :set_current_form, only: [:edit]
  before_action :set_preview, only: [:show]

  def edit
    super

    if @current_form == 'service_keywords'
      set_service_keywords
    elsif @current_form == 'science_and_ancillary_keywords'
      set_science_keywords
    end
  end

  private

  def set_schema
    @schema = UmmJsonSchema.new(plural_published_resource_name, 'umm-s-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = UmmJsonForm.new(plural_published_resource_name, 'umm-s-form.json', @schema, get_resource.draft, field_prefix: 'service_draft/draft', draft_id: get_resource.id)
  end

  def set_preview
    @preview = UmmPreview.new(
      schema_type: plural_published_resource_name,
      preview_filename: 'umm-s-preview.json',
      data: get_resource.draft,
      resource_name: resource_name,
      id: get_resource.id
    )
  end

  def set_current_form
    @current_form = params[:form] || @json_form.forms.first.parsed_json['id']
  end

  def service_draft_params
    # Allow for completely empty forms to be saved
    return {} unless params.key?(:service_draft)

    # If the form isn't empty, only permit whitelisted attributes
    params.require(:service_draft).permit(:draft_type).tap do |whitelisted|
      # Allows for any nested key within the draft hash
      whitelisted[:draft] = params[:service_draft][:draft]
    end
  end
end
