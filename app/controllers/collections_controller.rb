class CollectionsController < ApplicationController
  before_action :set_collection

  def show
  end

  def edit
    draft = Draft.create_from_collection(@collection, @current_user, @native_id)
    redirect_to draft_path(draft)
  end

  def destroy
    provider_id = @revisions.first['meta']['provider-id']
    delete = cmr_client.delete_collection(provider_id, @native_id, token)
    if delete.success?
      redirect_to collection_revisions_path(id: delete.body['concept-id'], revision_id: delete.body['revision-id'])
    else
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
      redirect_to collection_revisions_path(revision_id: latest_revision_id.to_i + 1)
    else
      Rails.logger.error("Ingest Metadata Error: #{ingested.inspect}")

      @error = true

      render action: 'revisions'
    end
  end

  private

  def set_collection
    concept_id = params[:id]
    revision_id = params[:revision_id]

    get_revisions

    latest = @revisions.first

    if latest
      @native_id = latest['meta']['native-id']
      @provider_id = latest['meta']['provider-id']
      concept_format = latest['meta']['format']

      # retrieve native metadata
      @metadata = cmr_client.get_concept(concept_id, revision_id, token)

      # translate to umm-json metadata
      @collection = cmr_client.translate_collection(@metadata, concept_format, 'application/umm+json').body
    else
      # concept wasn't found, CMR might be a little slow
      # Take the user to a blank page with a message the collection doesn't exist yet,
      # eventually auto refreshing the page would be cool
      @collection = {}
      @error = 'Your collection is being published. This page will show your published collection once it is ready. Please check back soon.'
    end
  end

  def get_revisions
    concept_id = params[:id]
    @revision_id = params[:revision_id]

    attempts = 0
    while attempts < 3
      @revisions = cmr_client.get_collections({ concept_id: concept_id, all_revisions: true }, token).body['items']
      @revisions.sort! { |a, b| b['meta']['revision-id'] <=> a['meta']['revision-id'] }
      latest = @revisions.first
      break if latest && !@revision_id
      break if latest && latest['meta']['revision-id'] >= @revision_id.to_i
      attempts += 1
      sleep 2
    end
  end
end
