class CollectionsController < ApplicationController
  def show
    # search based on concept id
    concept_id = params[:id]

    attempts = 0
    while attempts < 3
      concept = cmr_client.get_collections(concept_id: concept_id).body['items'].first
      break if concept
      attempts += 1
      sleep 2
    end

    if concept
      concept_format = concept['meta']['format']

      # retrieve native metadata
      metadata = cmr_client.get_concept(concept_id)

      # translate to umm-json metadata
      @collection = cmr_client.translate_collection(metadata, concept_format, 'application/umm+json').body
    else
      # concept wasn't found, CMR might be a little slow
      # Take the user to search results?
    end
  end
end
