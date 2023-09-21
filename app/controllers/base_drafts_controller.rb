# :nodoc:
class BaseDraftsController < DraftsController
  before_action :add_top_level_breadcrumbs
  before_action :set_forms, only: :new
  before_action :set_resource, only: [:show, :edit, :update, :destroy]

  def index
    resources = policy_scope(resource_class).order('updated_at DESC').page(params[:page]).per(RESULTS_PER_PAGE)

    plural_resource = "@#{plural_resource_name}"
    instance_variable_set(plural_resource, resources)
  end

  def show
    if !Rails.configuration.cmr_drafts_api_enabled
      if params[:not_authorized_request_params]
        @not_authorized_request = params[:not_authorized_request_params]
      else
        # authorize get_resource
      end
    end

    add_breadcrumb fetch_entry_id(get_resource['draft'], resource_name), send("#{resource_name}_path", get_resource)

    respond_to do |format|
      format.html { return }
      format.json { render json: JSON.pretty_generate(get_resource.draft) }
    end
  end

  def new
    set_resource(resource_class.new(provider_id: current_user.provider_id, user: current_user, draft: {}))

    # authorize get_resource

    add_breadcrumb 'New', send("new_#{resource_name}_path")

    set_form

    set_current_form
  end

  def edit
    if !Rails.configuration.cmr_drafts_api_enabled
      authorize get_resource
    end

    add_breadcrumb fetch_entry_id(get_resource['draft'], resource_name), send("#{resource_name}_path", get_resource)

    unless @json_form.get_form(@current_form).nil?
      add_breadcrumb @json_form.get_form(@current_form).title, send("edit_#{resource_name}_path", get_resource, @current_form)
    end
  end

  def create
    set_resource(resource_class.new(provider_id: current_user.provider_id, user: current_user, draft: {}))

    authorize get_resource

    set_form

    draft = @json_form.sanitize_form_input(resource_params, params[:form])

    get_resource.draft = draft['draft']

    get_resource.collection_concept_id = params[:associated_collection_id] if params[:associated_collection_id]

    if get_resource.save
      # Successful flash message
        flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.create.flash.success")
        Rails.logger.info("Audit Log: #{current_user.urs_uid} successfully created #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{current_user.provider_id}")

      # TODO: Prevent this piece of code from being duplicated
      case params[:commit]
      when 'Done'
        redirect_to send("#{resource_name}_path", get_resource)
      when 'Previous'
        # Determine next form to go to
        next_form_name = params['previous_section']
        redirect_to send("edit_#{resource_name}_path", get_resource, next_form_name)
      when 'Next'
        # tried to use render to avoid another request, but could not get form name in url even with passing in location
        get_resource_form = params['next_section']
        redirect_to send("edit_#{resource_name}_path", get_resource, get_resource_form)
      when 'Save'
        get_current_form = params['current_section']
        redirect_to send("edit_#{resource_name}_path", get_resource, get_current_form)
      else # Jump directly to a form
        next_form_name = params['jump_to_section']
        redirect_to send("edit_#{resource_name}_path", get_resource, next_form_name)
      end
    else
      errors_list = generate_model_error
      flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.create.flash.error")
      Rails.logger.info("Audit Log: #{current_user.urs_uid} could not create #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{current_user.provider_id} because of #{errors_list}")

      add_breadcrumb 'New', send("new_#{resource_name}_path")
      set_current_form
      render 'new'
    end
  end

  def update
    authorize get_resource

    sanitized_params = @json_form.sanitize_form_input(resource_params.dup, params[:form], get_resource.draft)

    if get_resource.update(sanitized_params)
      # Successful flash message
      flash[:success] = I18n.t("controllers.draft.#{plural_resource_name}.update.flash.success")
      Rails.logger.info("Audit Log: #{current_user.urs_uid} successfully updated #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{current_user.provider_id}")

      # TODO: Prevent this piece of code from being duplicated
      case params[:commit]
      when 'Done'
        redirect_to send("#{resource_name}_path", get_resource)
      when 'Previous'
        # Determine next form to go to
        next_form_name = params['previous_section']
        redirect_to send("edit_#{resource_name}_path", get_resource, next_form_name)
      when 'Next'
        # tried to use render to avoid another request, but could not get form name in url even with passing in location
        get_resource_form = params['next_section']
        redirect_to send("edit_#{resource_name}_path", get_resource, get_resource_form)
      when 'Save'
        get_current_form = params['current_section']
        redirect_to send("edit_#{resource_name}_path", get_resource, get_current_form)
      else # Jump directly to a form
        next_form_name = params['jump_to_section']
        redirect_to send("edit_#{resource_name}_path", get_resource, next_form_name)
      end
    else
      errors_list = generate_model_error
      flash[:error] = I18n.t("controllers.draft.#{plural_resource_name}.update.flash.error")
      Rails.logger.info("Audit Log: #{current_user.urs_uid} could not update #{resource_name.titleize} with title: '#{get_resource.entry_title}' and id: #{get_resource.id} for provider: #{current_user.provider_id} because of #{errors_list}")

      set_current_form
      add_breadcrumb fetch_entry_id(get_resource.draft, resource_name), send("#{resource_name}_path", get_resource)
      add_breadcrumb @json_form.get_form(@current_form).title, send("edit_#{resource_name}_path", get_resource, @current_form)
      render 'edit'
    end
  end

  def destroy
    authorize get_resource

    get_resource.destroy unless get_resource.new_record?

    Rails.logger.info("Audit Log: #{resource_name.titleize} #{get_resource.entry_title} was destroyed by #{current_user.urs_uid} in provider: #{current_user.provider_id}")

    respond_to do |format|
      format.html { redirect_to send("#{plural_resource_name}_path"), flash: { success: I18n.t("controllers.draft.#{plural_resource_name}.destroy.flash.success") } }
    end
  end

  private

  # Returns the resource from the created instance variable
  # @return [Object]
  def get_resource
    instance_variable_get("@#{resource_name}")
  end
  helper_method :get_resource

  # Returns the resources from the created instance variable
  # @return [Array]
  def get_resources
    instance_variable_get("@#{plural_resource_name}")
  end
  helper_method :get_resources

  # Returns the allowed parameters for searching
  # Override this method in each API controller
  # to permit additional parameters to search on
  # @return [Hash]
  def query_params
    {}
  end

  # The resource class based on the controller
  # @return [Class]
  def resource_class
    @resource_class ||= resource_name.classify.constantize
  end

  # The singular name for the resource class based on the controller
  # @return [String]
  def resource_name
    @resource_name ||= controller_name.singularize
  end
  helper_method :resource_name

  def plural_resource_name
    resource_name.pluralize
  end
  helper_method :plural_resource_name

  def published_resource_name
    resource_name.gsub('_draft', '')
  end
  helper_method :published_resource_name

  def plural_published_resource_name
    plural_resource_name.gsub('_draft', '')
  end
  helper_method :plural_published_resource_name

  # Only allow a trusted parameter "white list" through.
  # If a single resource is loaded for #create or #update,
  # then the controller for the resource must implement
  # the method "#{resource_name}_params" to limit permitted
  # parameters for the individual model.
  def resource_params
    @resource_params ||= send("#{resource_name}_params")
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_resource(resource = nil)
    if Rails.configuration.cmr_drafts_api_enabled
      native_id = params[:id]
      draft_type = "#{resource_name.sub('_','-')}s"
      cmr_response = cmr_client.search_draft(draft_type: draft_type, native_id: native_id, token: token)

      if cmr_response.success?
        result = cmr_response.body['items'][0]

        if result['umm'].key?('_meta')
          collection_concept_id = result['umm']['_meta']['collection_concept_id']
        end

        resource =
          {
            "id" =>  result['meta']['native-id'],
            "user_id" => result['meta']['user-id'],
            "draft" => result['umm'],
            "updated_at" => result['meta']['revision-date'],
            "short_name" => result['umm']['Name'],
            "entry_title" => result['umm']["LongName"],
            "provider_id" => result['meta']['provider-id'],
            "collection_concept_id" => collection_concept_id
        }
        instance_variable_set("@#{resource_name}", resource)
      end
    else
      resource ||= resource_class.find(params[:id])
      resource = JSON.parse(resource.to_json)
      instance_variable_set("@#{resource_name}", resource)
    end
  end

  def add_top_level_breadcrumbs
    add_breadcrumb plural_resource_name.titleize, send("#{plural_resource_name}_path")
  end

  def set_forms
    @forms = resource_class.forms
  end

  # Custom error messaging for Pundit
  def user_not_authorized(exception)
    policy_name = exception.policy.class.to_s.underscore

    if exception.query == 'show?' || exception.query == 'edit?'
      if available_provider?(get_resource.provider_id)
        # no flash message because it will be handled by the show view and params we are passing
        redirect_to send("#{resource_name}_path", get_resource, not_authorized_request_params: request.params)
      else
        flash[:error] = I18n.t("#{policy_name}.#{exception.query}", scope: 'pundit', default: :default)

        redirect_to send("manage_#{plural_published_resource_name}_path")
      end
    else
      flash[:error] = I18n.t("#{policy_name}.#{exception.query}", scope: 'pundit', default: :default)

      redirect_to send("manage_#{plural_published_resource_name}_path")
    end
  end

  def get_published_record_by_provider_and_native_id(provider:, native_id:)
    search_query = { 'native_id' => native_id, 'provider' => provider }
    if Rails.env.development?
      token = 'ABC-1'
    end
    search_response = cmr_client.send("get_#{plural_published_resource_name}", search_query, token)

    if search_response.success?
      return nil if search_response.body.fetch('hits', 0).zero?

      search_response.body.fetch('items', [{}]).first.fetch('meta', {}).fetch('concept-id', nil)
    else
      Rails.logger.error("Error searching for #{plural_published_resource_name} by #{search_query} in `get_published_record_by_provider_and_native_id`: #{search_response.clean_inspect}")

      @unconfirmed_version = true
    end
  end

  def ensure_published_record_supported_version
    concept_id = get_published_record_by_provider_and_native_id(provider: get_resource['provider_id'], native_id: get_resource['native_id'])

    return if concept_id.nil? || @unconfirmed_version

    compare_resource_umm_version(concept_id)
  end

  def generate_model_error
    return unless get_resource.errors.any?
    get_resource.errors.full_messages.reject(&:blank?).map(&:downcase).join(', ')
  end
end
