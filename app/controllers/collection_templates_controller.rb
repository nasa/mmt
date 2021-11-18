# frozen_string_literal: true

class CollectionTemplatesController < CollectionDraftsController
  include CMRCollectionsHelper
  # The syntax here differs from CollectionDraftsController in order to add
  # to things to an existing list.  If the before_action #action only: #list
  # syntax is used, it overwrites the parent list.  This saves redeclarations.
  before_action(only: :create_draft) { set_resource }
  before_action(only: :new_from_existing) { load_umm_c_schema }
  before_action :templates_enabled?

  def create_draft
    authorize get_resource
    draft = CollectionDraft.create_from_template(get_resource, current_user)
    Rails.logger.info("Audit Log: Collection Draft '#{draft.entry_title}' with id: #{draft.id} was created by #{current_user.urs_uid} from template with title: '#{get_resource.display_entry_title}' and id: #{get_resource.id} in provider: #{current_user.provider_id}")
    redirect_to edit_collection_draft_path(draft)
  end

  def new_view_setup
    super

    @template_names = names_list
  end

  def edit_view_setup
    super

    @template_names = names_list(params[:id])
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
    set_granule_data_formats
    set_umm_c_related_urls
    set_data_center_related_url
    set_data_contact_related_url

    @errors = validate_metadata

    @template_names = names_list

    render :new
  end

  def publish
    authorize get_resource
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

  def set_resource_by_model
    if params[:draft].blank?
      set_resource(resource_class.new(user: current_user, provider_id: current_user.provider_id, draft: {}))
    else
      draft = if params[:origin] == ''
                safe_hash(:draft)
              else
                fetch_source_data.deep_merge(safe_hash(:draft))
              end
      set_resource(resource_class.new(user: current_user, provider_id: current_user.provider_id, draft: draft.to_camel_keys, template_name: draft['template_name']))
    end
  end
end
