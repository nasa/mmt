# frozen_string_literal: true

class CollectionTemplatesController < CollectionDraftsController
  include CMRCollectionsHelper
  before_action :load_umm_schema, only: %i[new edit show new_from_existing]
  before_action :templates_enabled?

  def create_draft
    authorize get_resource
    draft = CollectionDraft.create_from_template(get_resource, current_user)
    Rails.logger.info("Audit Log: Collection Draft #{draft.entry_title} was created from a template by #{current_user.urs_uid} in provider: #{current_user.provider_id}")
    redirect_to edit_collection_draft_path(draft)
  end

  def new
    super

    @template_names = names_list
  end

  def create
    if names_list.include?(params[:draft][:template_name])
      flash[:error] = 'A template with that name already exists.'
      redirect_to manage_collections_path
      return
    end

    # Need to fetch and merge the old data in because the params[:draft] only has the form.
    # If new submitted no origin, then it's a fresh draft, and the provided draft can be
    # used.  Otherwise, the data provided by the user needs to be merged with the source data.
    new_draft = if params[:origin] == ''
                  params[:draft]
                else
                  fetch_source_data.deep_merge(params[:draft])
                end
    set_resource(resource_class.new(user: current_user, provider_id: current_user.provider_id, draft: new_draft.to_camel_keys))

    # Adding a uniqueness constraint to the DB will cause it to throw an exception
    # during race conditions that the current validation can't catch.  This should
    # provide the user a smoother experience in this rare event.
    begin
      super
    rescue ActiveRecord::RecordNotUnique
      flash[:error] = 'A template with that name already exists.'
      redirect_to manage_collections_path
    end
  end

  def new_from_existing
    set_resource(resource_class.new(user: current_user, provider_id: current_user.provider_id, draft: fetch_source_data))
    authorize get_resource

    @forms = resource_class.forms
    @form = params[:form] || @forms.first

    add_breadcrumb 'New', new_collection_template_path

    set_science_keywords
    set_location_keywords
    set_projects
    set_country_codes
    set_language_codes
    set_platform_short_names
    set_instrument_short_names
    set_temporal_keywords

    @errors = validate_metadata

    @template_names = names_list

    render :new
  end

  def publish
    flash[:error] = 'Templates cannot be published.'
    redirect_to manage_collections_path
  end

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
      collection = (collection_response.body if collection_response.success?)
      collection
    else
      nil
    end
  end

  # Provide a list of names currently in the database for validation.
  def names_list(id = nil)
    policy_scope(resource_class).each_with_object([]) do |template, memo|
      memo << template['template_name'] unless template.id == id.to_i
    end
  end

  # Helper function to fetch the original data during new/create.
  def fetch_source_data
    if params[:origin] == 'CollectionDraft'
      source_collection = CollectionDraft.where(id: params[:collection_id])[0].draft
    elsif params[:origin] == 'Collection'
      revision_id = if params[:revision_id] == ''
                      nil
                    else
                      params[:revision_id]
                    end
      source_collection = request_collection_by_id(params[:collection_id], revision_id)
    end

    # If CMR did not find the collection, redirect to manage collections and flash an error.
    # Also addresses a bad id being passed to CollectionDraft
    if source_collection.nil?
      flash[:error] = 'The requested collection could not be found at this time.'
      redirect_to manage_collections_path
    end

    source_collection
  end
end
