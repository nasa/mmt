module Helpers
  # :nodoc:
  module BulkUpdateHelper
    def create_bulk_update(provider_id: 'MMT_2', payload: {}, admin: false)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::BulkUpdateHelper#create_bulk_update' do
        bulk_update_params = payload

        bulk_update_response = cmr_client.create_bulk_update(provider_id, bulk_update_params, admin ? 'access_token_admin' : 'access_token')

        return bulk_update_response.body
      end
    end
  end
end
