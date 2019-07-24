class CollectionTemplatesController < CollectionDraftsController
  include CollectionsCmrHelper
  before_action :templates_enabled?
  before_action :set_resource, only: [:create_draft, :destroy, :edit, :update, :show]
  before_action :load_umm_schema, only: [:new, :edit, :show, :from_existing]

  def create_draft
    authorize get_resource
    draft = CollectionDraft.create_from_template(get_resource, current_user)
    Rails.logger.info("Audit Log: Collection Draft #{draft.entry_title} was created by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
    redirect_to edit_collection_draft_path(draft)
  end

  def new
    super

    @template_names = names_list
  end

  def names_list(id = nil)
    policy_scope(resource_class).map{ |template| template['template_name'] unless template.id == id }
  end

  def from_existing
    if params[:origin] == "CollectionDraft"
      source_collection = CollectionDraft.where(id: params[:draft])[0]
    elsif params[:origin] == "Collection"
      if params[:revision_id] == ""
        revision_id = nil
      else
        revision_id = params[:revision_id]
      end
      source_collection = CollectionData.new(request_collection_by_id(params[:collection_id], revision_id))
    end

    #TODO: source_collection == nil handling

    set_resource(source_collection)

    @draft_forms = CollectionDraft.forms
    @draft_form = params[:form] || @draft_forms.first

    add_breadcrumb 'New', new_collection_draft_path

    set_science_keywords
    set_location_keywords
    set_projects
    set_country_codes
    set_language_codes
    set_platform_short_names
    set_instrument_short_names

    @errors = validate_metadata

    @template_names = names_list

    render :new
  end

  #define create and edit such that they cannot overwrite with non-unique names in situations like using back.

  # This is largely duplicate from collections_controller, but templates don't need
  # all of the things that collections do.  Unsure if an alternate implementation is
  # better...
  def request_collection_by_id(id, revision_id)
    revisions = get_revisions(id, revision_id)

    latest = revisions.first

    # if there is at least one revision available
    if latest
      # set accept content-type as umm-json with our current umm-c version
      content_type = "application/#{Rails.configuration.umm_c_version}; charset=utf-8"

      collection_response = cmr_client.get_concept(id, token, { 'Accept' => content_type }, nil)
      if collection_response.success?
        collection = collection_response.body
      else
        collection = nil
        #TODO: failure handling
      end
      collection
    else
      # concept wasn't found, CMR might be a little slow
      # Take the user to a blank page with a message the collection doesn't exist yet,
      # eventually auto refreshing the page would be cool
      nil
    end
  end

  # Data-sack class so that collections respond to .draft, .errors, and .new_record?
  class CollectionData
    attr_reader :draft, :errors
    def initialize(draft)
      @draft = draft
      @errors = []
    end

    def new_record?
      true
    end
  end

end
