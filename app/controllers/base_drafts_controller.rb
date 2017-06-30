class BaseDraftsController < DraftsController
  before_action :add_top_level_breadcrumbs

  def index
    resources = current_user.drafts.where(draft_type: params[:draft_type]).where(provider_id: current_user.provider_id)
                            .order('updated_at DESC').page(params[:page]).per(RESULTS_PER_PAGE)

    plural_resource = "@#{plural_resource_name}"
    instance_variable_set(plural_resource, resources)
  end

  def show
    set_resource

    add_breadcrumb display_entry_id(get_resource.draft, 'draft'), send("#{resource_name}_path", get_resource)
  end

  def new
    set_resource(resource_class.new)

    add_breadcrumb 'New', send("new_#{resource_name}_path")
  end

  def edit
    respond_with get_resource
  end

  def create
    set_resource(resource_class.new(resource_params))

    respond_with(get_resource) do |format|
      if get_resource.save
        format.html { redirect_to send("edit_#{resource_name}_path", get_resource), flash: { success: I18n.t("controllers.draft.#{plural_resource_name}.create.flash.success") } }
      else
        format.html { render 'new' }
      end
    end
  end

  def update
    respond_with(get_resource) do |format|
      if get_resource.update(resource_params)
        format.html { redirect_to send("edit_#{resource_name}_path", get_resource), flash: { success: I18n.t("controllers.draft.#{plural_resource_name}.update.flash.success") } }
      else
        format.html { render 'edit' }
      end
    end
  end

  def destroy
    get_resource.destroy unless get_resource.new_record?

    Rails.logger.info("Audit Log: Draft #{get_resource.entry_title} was destroyed by #{current_user.urs_uid} in provider: #{current_user.provider_id}")

    respond_to do |format|
      format.html { redirect_to manage_metadata_path, flash: { success: 'Draft was successfully deleted.' } }
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

  def plural_resource_name
    resource_name.pluralize
  end

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
    resource ||= resource_class.find(params[:id])
    instance_variable_set("@#{resource_name}", resource)
  end

  def add_top_level_breadcrumbs
    add_breadcrumb plural_resource_name.titleize, send("#{plural_resource_name}_path")
  end
end
