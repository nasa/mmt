module CMRSubscriptions
  extend ActiveSupport::Concern

  # This is derived from a similar method found in the cmr_collections_helper
  # Subscriptions face a similar challenge where without something like this,
  # MMT can try to load the page without finding the user's new content.
  def get_latest_revision(concept_id, revision_id)
    attempts = 0
    while attempts < 20
      revisions_response = cmr_client.get_subscriptions({ concept_id: concept_id }, token)

      revisions = if revisions_response.success?
                    revisions_response.body.fetch('items', [])
                  else
                    []
                  end
      revisions.select! { |revision| revision['meta']['deleted'] == false }
      revisions.sort! { |a, b| b['meta']['revision-id'] <=> a['meta']['revision-id'] }

      latest = revisions.first

      return latest if latest.present? && latest['meta']['revision-id'].to_s >= revision_id.to_s

      attempts += 1
      sleep 0.05
    end
    nil
  end
end