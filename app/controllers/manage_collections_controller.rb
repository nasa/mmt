# :nodoc:
class ManageCollectionsController < ManageMetadataController
  include BulkUpdates

  def show
    # If you change this number you must also change it in the corresponding test file - features/manage_collections/open_drafts_spec.rb.
    @draft_display_max_count = 5

    @drafts = policy_scope(CollectionDraft).order('updated_at DESC')
                                         .limit(@draft_display_max_count + 1)

    @bulk_updates = retrieve_bulk_updates.take(@draft_display_max_count + 1)
  end
end
