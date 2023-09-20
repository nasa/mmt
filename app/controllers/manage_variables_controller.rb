# :nodoc:
class ManageVariablesController < ManageMetadataController
  def show
    # If you change this number you must also change it in the corresponding test file - features/manage_metadata/open_drafts_spec.rb.
    @draft_display_max_count = 5

    if Rails.configuration.cmr_drafts_api_enabled
      cmr_response = cmr_client.provider_search_draft(draft_type: 'variable-drafts', token: token)
      if cmr_response.success?
        result = cmr_response.body
        @drafts = []
        puts(result)
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
            puts(item)
          end
        end
        @drafts
      end
    else
      @drafts = policy_scope(VariableDraft).order('updated_at DESC')
                                           .limit(@draft_display_max_count + 1)
      @drafts = JSON.parse(@drafts.to_json)
    end
  end
end
