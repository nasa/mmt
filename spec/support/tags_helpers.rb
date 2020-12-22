module Helpers
  module TagsHelpers
    def setup_tag_permissions
      # this method is necessary because the local cmr system token is not
      # automatically provided the system Tags ACL
      # this can be removed with MMT-2360 after CMR-6654 is worked
      sys_admin_group_concept = group_concept_from_name('Administrators_2', 'access_token_admin')

      permission_params = {
        group_permissions: [{
          group_id: sys_admin_group_concept,
          permissions: ['create', 'update', 'delete']
        }],
        system_identity: {
          target: 'TAG_GROUP'
        }
      }

      response = add_group_permissions(permission_params, 'access_token_admin')

      reindex_permitted_groups
      wait_for_cmr
      clear_cache

      response.body['concept_id']
    end

    def create_tags(tag_key, description = nil)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::TagsHelpers#create_tags' do
        response = cmr_client.create_tag(tag_key, 'access_token_admin', description)
        puts response.clean_inspect unless response.success?

        wait_for_cmr
      end
    end

    def associate_tag_to_collection_by_short_name(tag_key, short_name)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::TagsHelpers#associate_tag_to_collection' do
        response = cmr_client.associate_tag_by_collection_short_name(tag_key, short_name, 'access_token_admin')
        puts response.clean_inspect unless response.success?

        wait_for_cmr
      end
    end
  end
end
