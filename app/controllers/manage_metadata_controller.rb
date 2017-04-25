# :nodoc:
class ManageMetadataController < PagesController
  before_filter :set_notifications

  layout 'manage_metadata'

  def show
    # If you change this number you must also change it in the corresponding test file - features/drafts/open_drafts_spec.rb.
    @draft_display_max_count = 5

    @drafts = current_user.drafts.where(provider_id: current_user.provider_id)
                          .order('updated_at DESC')
                          .limit(@draft_display_max_count + 1)
  end
end
