# :nodoc:
class VariableDraftsController < BaseDraftsController
  before_action :set_resource, only: [:show, :edit, :update, :destroy]
  before_action :set_schema, only: [:show, :new, :edit, :update, :create]
  before_action :set_form, only: [:show, :edit, :update]
  before_action :set_current_form, only: [:edit]
  before_action :set_science_keywords, only: [:new, :edit]
  before_action :ensure_correct_draft_provider, only: [:edit, :show]

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
    # TODO: Move this into the UmmKeywordPicker class, including the rendering of JavaScript
    @science_keywords = cmr_client.get_controlled_keywords('science_keywords')
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

  def ensure_correct_draft_provider
    return if get_resource.provider_id == current_user.provider_id || get_resource.new_record?

    @draft_action = request.original_url.include?('edit') ? 'edit' : 'view'
    @draft_form = params[:form] ? params[:form] : nil

    @user_permissions = if current_user.available_providers.include?(get_resource.provider_id)
                          'wrong_provider'
                        else
                          'none'
                        end
    render :show
  end
end
