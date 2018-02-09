# :nodoc:
class VariableDraftsController < BaseDraftsController
  include ControlledKeywords
  before_action :set_resource, only: [:show, :edit, :update, :destroy]
  before_action :set_schema, only: [:show, :new, :edit, :update, :create]
  before_action :set_form, only: [:show, :edit, :update]
  before_action :set_current_form, only: [:edit]

  def edit
    super

    set_science_keywords if @current_form == 'science_keywords'
  end

  private

  def set_schema
    @schema = UmmJsonSchema.new(plural_published_resource_name, 'umm-var-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = UmmJsonForm.new(plural_published_resource_name, 'umm-var-form.json', @schema, get_resource.draft, 'field_prefix' => 'variable_draft/draft')
  end

  def set_current_form
    @current_form = params[:form] || @json_form.forms.first.parsed_json['id']
  end

  def variable_draft_params
    # Allow for completely empty forms to be saved
    return {} unless params.key?(:variable_draft)

    # If the form isn't empty, only permit whitelisted attributes
    params.require(:variable_draft).permit(:draft_type).tap do |whitelisted|
      # Allows for any nested key within the draft hash
      whitelisted[:draft] = params[:variable_draft][:draft]
    end
  end
end
