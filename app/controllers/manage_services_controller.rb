# :nodoc:
class ManageServicesController < ManageMetadataController
  before_action :umm_s_enabled?

  def show
    # If you change this number you must also change it in the corresponding test file - features/manage_services/open_drafts_spec.rb.
    @draft_display_max_count = 5

    if Rails.configuration.cmr_drafts_api_enabled
      cmr_response = cmr_client.provider_search_draft(draft_type: 'service-drafts', token: token)

      if cmr_response.success?
        result = cmr_response.body
        @drafts = []
        result['items'].each do |item|
          if current_user.provider_id === item['meta']['provider-id']
            @drafts.push(
              {
                "id" => item['meta']['native-id'],
                "user_id" => item['meta']['user-id'],
                "draft" => item['umm'],
                "updated_at" => item['meta']['revision-date'],
                "short_name" => item['umm']['Name'],
                "entry_title" => item['umm']["LongName"],
                "provider_id" => item['meta']['provider-id'],
              }
            )
          end
        end
      end
    else
      @drafts = ServiceDraft.where(provider_id: current_user.provider_id)
                            .order('updated_at DESC')
                            .limit(@draft_display_max_count + 1)
      @drafts = JSON.parse(@drafts.to_json)
    end



  end
end
