# :nodoc:
class VariableDraftsController < BaseDraftsController
  before_action :set_schema, only: [:new, :edit]
  before_action :set_form, only: [:edit]
  before_action :set_current_form, only: [:edit]
  before_action :set_science_keywords, only: [:new, :edit]

  def new
    super
    
    set_form

    set_current_form
  end

  private

  def set_schema
    @schema = UmmJsonSchema.new('umm-var-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = UmmJsonForm.new('umm-var-form.json', @schema, get_resource.draft, 'field_prefix' => 'variable_draft/draft')
  end

  def set_current_form
    @current_form = params[:form] || @json_form.forms.first.parsed_json['id']
  end

  def set_science_keywords
    @science_keywords = cmr_client.get_controlled_keywords('science_keywords')
  end

  def variable_draft_params
    params.require(:variable_draft).permit(:draft_type).tap do |whitelisted|
      # Allows for any nested key within the draft hash
      whitelisted[:draft] = params[:variable_draft][:draft]
    end
  end
end
