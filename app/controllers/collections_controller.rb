class CollectionsController < ApplicationController
  before_action :set_collection
  def show
  end

  def edit
    draft = Draft.create_from_collection(@collection, @current_user, @native_id)
    redirect_to draft_path(draft)
  end

  private

  def set_collection
    concept_id = params[:id]
    @revision_id = params[:revision_id]

    attempts = 0
    while attempts < 3
      concept = cmr_client.get_collections({ concept_id: concept_id }, token).body['items'].first
      break if concept && !@revision_id
      break if concept && concept['meta']['revision-id'] == @revision_id
      attempts += 1
      sleep 2
    end

    if concept
      @native_id = concept['meta']['native-id']
      concept_format = concept['meta']['format']

      # retrieve native metadata
      metadata = cmr_client.get_concept(concept_id, @revision_id, token)

      # translate to umm-json metadata
      @collection = cmr_client.translate_collection(metadata, concept_format, 'application/umm+json').body
    else
      # concept wasn't found, CMR might be a little slow
      # Take the user to a blank page with a message the collection doesn't exist yet,
      # eventually auto refreshing the page would be cool
      @collection = {}
      @error = 'Your collection is being published. This page will show your published collection once it is ready. Please check back soon.'
    end
  end
end
