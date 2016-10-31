class User < ActiveRecord::Base
  serialize :available_providers, JSON

  has_many :drafts

  def self.from_urs_uid(uid)
    return nil if uid.nil?
    User.find_or_create_by(urs_uid: uid)
  end

  def providers=(providers)
    self.available_providers = providers

    # TODO: If there are multiple, it seems as though it'd be kind to set it to the first?
    self.provider_id = providers.first if providers.size == 1
  end

  def set_available_providers
    cmr_client = Cmr::Client.client_for_environment(Rails.configuration.cmr_env, Rails.configuration.services)

    # Get groups the user belongs to
    groups = cmr_client.get_groups(echo_id).body
    group_ids = groups.map { |group| group['group']['id'] }

    providers = if group_ids && !group_ids.empty?
                  # Get all ACLs
                  acls = cmr_client.get_provider_acls.body

                  # Pull out nly the acls that apply to this
                  good_acls = acls.select do |acl|
                    # If the ACL is an ingest ACL
                    is_ingest_acl = acl['acl']['provider_object_identity']['target'] == 'INGEST_MANAGEMENT_ACL'

                    # if access_control_entries includes at least one of the users group_ids
                    # and the UPDATE permission is found
                    groups_with_update = acl['acl']['access_control_entries'].count do |entry|
                      group_ids.include?(entry['sid']['group_sid']['group_guid']) && entry['permissions'].include?('UPDATE')
                    end

                    # Qualifications for a good provider
                    is_ingest_acl && groups_with_update > 0
                  end

                  # Get the provider_guids
                  provider_guids = good_acls.map { |acl| acl['acl']['provider_object_identity']['provider_guid'] }

                  # Get all providers
                  all_providers = cmr_client.get_all_providers.body

                  # Find provider_ids for provider_guids and sort
                  all_providers.select { |provider| provider_guids.include? provider['provider']['id'] }.map { |provider| provider['provider']['provider_id'] }.sort
                end

    # Call the above setter to handle additional logic involved with providers
    self.providers = providers || []

    save
  end
end
