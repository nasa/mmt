class CollectionsController < ApplicationController
  before_action :set_collection

  def show
  end

  def edit
    draft = Draft.create_from_collection(@collection, @current_user, @native_id)
    flash[:success] = 'Draft was successfully created'
    redirect_to draft_path(draft)
  end

  def clone
    draft = Draft.create_from_collection(@collection, @current_user, nil)

    flash[:notice] = view_context.link_to 'Records must have a unique Entry ID. Click here to enter a new Entry ID.', draft_edit_form_path(draft, 'data_identification', anchor: 'collection-information')

    redirect_to draft_path(draft)
  end

  def destroy
    provider_id = @revisions.first['meta']['provider-id']
    delete = cmr_client.delete_collection(provider_id, @native_id, token)
    if delete.success?
      flash[:success] = 'Collection was successfully deleted'
      redirect_to collection_revisions_path(id: delete.body['concept-id'], revision_id: delete.body['revision-id'])
    else
      flash[:error] = 'Collection was not successfully deleted'
      render :show
    end
  end

  def revisions
  end

  def revert
    latest_revision_id = @revisions.first['meta']['revision-id']

    # Ingest revision
    ingested = cmr_client.ingest_collection(@metadata, @provider_id, @native_id, token)

    if ingested.success?
      flash[:success] = 'Revision was successfully created'
      redirect_to collection_revisions_path(revision_id: latest_revision_id.to_i + 1)
    else
      Rails.logger.error("Ingest Metadata Error: #{ingested.inspect}")

      @error = true

      flash[:error] = 'Revision was not successfully created'
      render action: 'revisions'
    end
  end

  private

  def set_collection
    concept_id = params[:id]
    revision_id = params[:revision_id]

    set_collection_link(concept_id)
    set_num_granules(concept_id)

    @revisions = get_revisions(concept_id, revision_id)

    latest = @revisions.first

    # if there is at least one revision available
    if latest
      @native_id = latest['meta']['native-id']
      @provider_id = latest['meta']['provider-id']
      concept_format = latest['meta']['format']

      if !revision_id.nil? && latest['meta']['revision-id'].to_s != revision_id.to_s
        @old_revision = true
      end

      # retrieve native metadata
      @metadata = cmr_client.get_concept(concept_id, token, revision_id)

      # translate to umm-json metadata
      @collection = cmr_client.translate_collection(@metadata, concept_format, 'application/umm+json', true).body
    else
      # concept wasn't found, CMR might be a little slow
      # Take the user to a blank page with a message the collection doesn't exist yet,
      # eventually auto refreshing the page would be cool
      @collection = {}
      @error = 'Your collection is being published. This page will show your published collection once it is ready. Please check back soon.'
    end
  end

  def get_revisions(concept_id, revision_id)
    # if the revision is not found, try again because CMR might be a little slow to index if it is a newly published revision
    attempts = 0
    while attempts < 3
      revisions = cmr_client.get_collections({ concept_id: concept_id, all_revisions: true }, token).body['items']
      revisions.sort! { |a, b| b['meta']['revision-id'] <=> a['meta']['revision-id'] }
      latest = revisions.first
      break if latest && !revision_id
      break if latest && latest['meta']['revision-id'] >= revision_id.to_i
      attempts += 1
      sleep 2
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
