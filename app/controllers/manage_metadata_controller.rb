# :nodoc:
class ManageMetadataController < PagesController
  include BulkUpdates

  before_filter :set_notifications

  layout 'manage_metadata'

  def show
    # If you change this number you must also change it in the corresponding test file - features/manage_metadata/open_drafts_spec.rb.
    @draft_display_max_count = 5

    @drafts = current_user.drafts.where(provider_id: current_user.provider_id)
                          .order('updated_at DESC')
                          .limit(@draft_display_max_count + 1)

    # with the dummy data response, we can't currently limit the number of responses, but we
    # should do so when it is available and try to sort by most recent as well
    @bulk_updates = retrieve_bulk_updates.take(@draft_display_max_count + 1)
  end
end
