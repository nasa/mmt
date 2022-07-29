module Helpers
  # :nodoc:
  module GroupHelper
    def create_group(provider_id: 'MMT_2', name: random_group_name, description: random_group_description, members: [], admin: false)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::GroupHelper#create_group' do
        group_params = {
          'name'        => name,
          'description' => description
        }
        # System level groups don't have a provider_id
        group_params['provider_id'] = provider_id unless provider_id.nil?

        # If members were provided, include them in the payload
        group_params['members'] = members if members.any?

        group_response = cmr_client.create_edl_group(group_params)

        # raise Array.wrap(group_response.body['errors']).join(' /// ') if group_response.body.key?('errors')
        #
        # wait_for_cmr

        group_response.body
      end
    end

    def delete_group(concept_id:, admin: false)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::GroupHelper#create_group' do
        group_response = cmr_client.delete_group(concept_id, admin ? 'access_token_admin' : 'access_token')

        raise Array.wrap(group_response.body['errors']).join(' /// ') if group_response.body.key?('errors')

        wait_for_cmr

        group_response.success?
      end
    end

    # Need to change from random_group_name to just "group_name"
    def random_group_name
      return '58732ce072d1ecb9b24d'
      # hex = SecureRandom.hex(10)
      # puts("hex=#{hex}")
      # hex
    end

    def random_group_description
      Faker::Lorem.sentence
    end

    def add_group_permissions(permission_params, token = 'access_token')
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::GroupHelper#add_group_permissions' do
        permission_response = cmr_client.add_group_permissions(permission_params, token)

        raise Array.wrap(permission_response.body['errors']).join(' /// ') if permission_response.body.key?('errors')

        wait_for_cmr

        permission_response.body
      end
    end

    def add_permissions_to_group(group_id, permissions, target, provider_id)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::GroupHelper#add_permissions_to_group' do
        permission_params = {
          group_permissions: [{
            group_id: group_id,
            permissions: Array.wrap(permissions)
          }],
          provider_identity: {
            provider_id: provider_id,
            target: target
          }
        }

        add_group_permissions(permission_params)
      end
    end

    def add_associated_permissions_to_group(group_id: 'AG1200000001-CMR', name: 'Test Permission', provider_id: 'MMT_2', permissions: ['read'])
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::GroupHelper#add_permissions_to_group' do
        permission_params = {
          group_permissions: [
            {
              group_id: group_id,
              permissions: permissions
            }
          ],
          catalog_item_identity: {
            name: name,
            provider_id: provider_id,
            granule_applicable: false,
            collection_applicable: true
          }
        }

        add_group_permissions(permission_params)
      end
    end

    def remove_group_permissions(concept_id)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::GroupHelper#remove_group_permissions' do
        acl_response = cmr_client.delete_permission(concept_id, 'access_token_admin')

        raise Array.wrap(acl_response.body['errors']).join(' /// ') if acl_response.body.key?('errors')

        wait_for_cmr

        acl_response.success?
      end
    end

    # grabs an existing ACL. can be helpful for debugging tests where permissions
    # seem to be an issue
    def fetch_acl(concept_id)
      acl_response = cmr_client.get_permission(concept_id, 'token')
      acl_response.body
    end
  end
end
