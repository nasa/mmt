# :nodoc:
class ManageServicesController < ManageMetadataController
  before_action :umm_s_enabled?

  def show
    # If you change this number you must also change it in the corresponding test file - features/manage_services/open_drafts_spec.rb.
    @draft_display_max_count = 5

    @drafts = ServiceDraft.where(provider_id: current_user.provider_id)
                          .order('updated_at DESC')
                          .limit(@draft_display_max_count + 1)
  end
end
