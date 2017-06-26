class CollectionsController < ManageMetadataController
  include ManageMetadataHelper

  before_action :set_collection
  before_action :ensure_correct_collection_provider, only: [:edit, :clone, :revert, :destroy]

  add_breadcrumb 'Collections' # there is no collections index action, so not providing a link

  def show
    @language_codes = cmr_client.get_language_codes
    @draft = Draft.where(provider_id: @provider_id, native_id: @native_id).first

    add_breadcrumb display_entry_id(@collection, 'collection'), collection_path(@collection)
  end

  def edit
    draft = Draft.create_from_collection(@collection, current_user, @native_id)
    Rails.logger.info("Audit Log: Draft for #{draft.entry_title} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
    flash[:success] = 'Draft was successfully created'
    redirect_to draft_path(draft)
  end

  def clone
    draft = Draft.create_from_collection(@collection, current_user, nil)

    flash[:notice] = view_context.link_to 'Records must have a unique Short Name. Click here to enter a new Short Name.', draft_edit_form_path(draft, 'collection_information', anchor: 'collection-information')

    redirect_to draft_path(draft)
  end

  def destroy
    provider_id = @revisions.first['meta']['provider-id']
    delete = cmr_client.delete_collection(provider_id, @native_id, token)
    if delete.success?
      flash[:success] = 'Collection was successfully deleted'
      Rails.logger.info("Audit Log: Collection with native_id #{@native_id} was deleted for #{provider_id} by #{session[:urs_uid]}")
      redirect_to collection_revisions_path(id: delete.body['concept-id'], revision_id: delete.body['revision-id'])
    else
      flash[:error] = 'Collection was not successfully deleted'
      render :show
    end
  end

  def revisions
    add_breadcrumb display_entry_id(@collection, 'collection'), collection_path(@collection)
    add_breadcrumb 'Revision History', collection_revisions_path(@collection)
  end

  def revert
    latest_revision_id = @revisions.first['meta']['revision-id']

    # Ingest revision
    metadata = @collection_format.include?('umm+json') ? @collection.to_json : @collection
    ingested = cmr_client.ingest_collection(metadata, @provider_id, @native_id, token, @collection_format)

    if ingested.success?
      flash[:success] = 'Revision was successfully created'
      Rails.logger.info("Audit Log: Revision for draft with native_id: #{@native_id} for provider: #{@provider_id} by user #{session[:urs_uid]} has been successfully revised")
      redirect_to collection_revisions_path(revision_id: latest_revision_id.to_i + 1)
    else
      Rails.logger.error("Ingest Metadata Error: #{ingested.inspect}")

      @errors = generate_ingest_errors(ingested)

      flash[:error] = 'Revision was not successfully created'
      render action: 'revisions'
    end
  end

  private

  def ensure_correct_collection_provider
    return if @provider_id == current_user.provider_id

    case
    when request.original_url.include?('edit')
      @collection_action = 'edit'
    when request.original_url.include?('clone')
      @collection_action = 'clone'
    when request.original_url.include?('revert')
      @collection_action = 'revert'
    when request.original_url.include?('delete')
      @collection_action = 'delete'
    end

    @user_permissions = 'none'
    if current_user.available_providers && current_user.available_providers.include?(@provider_id)
      @user_permissions = 'wrong_provider'
    end

    render :show
  end

  def set_collection
    @concept_id = params[:id]
    @revision_id = params[:revision_id]

    set_collection_link(@concept_id)
    set_num_granules(@concept_id)

    @revisions = get_revisions(@concept_id, @revision_id)

    latest = @revisions.first

    # if there is at least one revision available
    if latest
      @native_id = latest['meta']['native-id']
      @provider_id = latest['meta']['provider-id']
      concept_format = latest['meta']['format']

      if !@revision_id.nil? && latest['meta']['revision-id'].to_s != @revision_id.to_s
        @old_revision = true
      end

      # set accept content-type as umm-json with our current umm-c version
      content_type = "application/#{Rails.configuration.umm_version}; charset=utf-8"
      # but if we are reverting, we should get the collection in it's native format, so set content-type appropriately
      content_type = 'application/metadata+xml; charset=utf-8' if params[:action] == 'revert'

      collection_response = cmr_client.get_concept(@concept_id, token, content_type, @revision_id)
      @collection = collection_response.body
      @collection_format = collection_response.headers.fetch('content-type', '')
    else
      # concept wasn't found, CMR might be a little slow
      # Take the user to a blank page with a message the collection doesn't exist yet,
      # eventually auto refreshing the page would be cool
      @collection = {}
      @error = 'This collection is not available. It is either being published right now, does not exist, or you have insufficient permissions to view this collection.'
    end
  end

  def get_revisions(concept_id, revision_id)
    # if the revision is not found, try again because CMR might be a little slow to index if it is a newly published revision
    # TODO: this has to go
    attempts = 0
    while attempts < 20
      revisions = cmr_client.get_collections_by_post({ concept_id: concept_id, all_revisions: true }, token).body['items']
      revisions.sort! { |a, b| b['meta']['revision-id'] <=> a['meta']['revision-id'] }
      latest = revisions.first
      break if latest && !revision_id
      break if latest && latest['meta']['revision-id'] >= revision_id.to_i
      attempts += 1
      sleep 0.05
    end

    revisions
  end

  def set_collection_link(concept_id)
    # collection_link used for downloading XML
    base_url = 'http://localhost:3003'
    if Rails.env.sit?
      base_url = 'https://cmr.sit.earthdata.nasa.gov/search'
    elsif Rails.env.uat?
      base_url = 'https://cmr.uat.earthdata.nasa.gov/search'
    elsif Rails.env.production?
      base_url = 'https://cmr.earthdata.nasa.gov/search'
    end
    @collection_link = "#{base_url}/concepts/#{concept_id}"
  end

  def set_num_granules(concept_id)
    # Get granule count, will be replaced once CMR-2053 is complete
    granule_result = cmr_client.get_granule_count(concept_id, token)
    @num_granules = granule_result.nil? ? 0 : granule_result['granule_count']
  end
end
