# These methods are used by both SystemIdentityPermissionsController and
# ProviderIdentityPermissionsController. Eventually we will migrate these methods
# to a class/module for Cmr
module PermissionManagement
  extend ActiveSupport::Concern

  # for the methods below, some require type (i.e. 'provider' or 'system') and
  # some require identity_type (i.e. 'provider_identity' or 'system_identity')

  def get_permissions_for_identity_type(type:)
    permissions_list = []

    options = { 'include_full_acl' => true,
                'identity_type' => type,
                'page_size' => 50 }

    options['provider'] = current_user.provider_id if type == 'provider'

    permissions_response = cmr_client.get_permissions(options, token)
    if permissions_response.success?
      permissions_list = permissions_response.body['items']
    else
      Rails.logger.error("Get #{type.titleize} Identity Permissions Error: #{permissions_response.clean_inspect}")
      flash[:error] = permissions_response.error_message
    end

    permissions_list
  end

  def assemble_permissions_for_table(permissions:, type:, group_id:)
    assembled_permissions = {}
    revision_ids = {}

    identity_type = "#{type}_identity"
    permissions.each do |perm|
      target = perm.fetch('acl', {}).fetch(identity_type, {}).fetch('target', nil)

      group_permission = perm.fetch('acl', {}).fetch('group_permissions', []).select { |group_perm| group_perm['group_id'] == group_id }
      granted_permissions = group_permission[0]&.fetch('permissions', [])

      assembled_permissions[target] = granted_permissions if granted_permissions.present?
      revision_ids[perm['acl']["#{type}_identity"]['target']] = perm['revision_id']
    end

    [assembled_permissions, revision_ids]
  end

  def assemble_permissions_for_updating(full_permissions:, type:, group_id:)
    assembled_permissions = {}
    revision_ids = {}

    identity_type = "#{type}_identity"
    full_permissions.each do |perm|
      permission_concept_id = perm['concept_id']
      target = perm.fetch('acl', {}).fetch(identity_type, {}).fetch('target', nil)
      group_perms = perm.fetch('acl', {}).fetch('group_permissions', [])
      num_groups_in_permission = group_perms.count

      matching_group_permission = group_perms.select { |group_perm| group_perm['group_id'] == group_id }
      if matching_group_permission.blank?
        matched_to_group = false
        granted_permissions = []
      else
        matched_to_group = true
        granted_permissions = matching_group_permission[0].fetch('permissions', nil)
      end

      assembled_permissions[target] = {
        'permission_concept_id' => permission_concept_id,
        'num_groups' => num_groups_in_permission,
        'matched_to_group' => matched_to_group,
        'granted_permissions' => granted_permissions
      }

      revision_ids[perm['acl']["#{type}_identity"]['target']] = perm['revision_id']
    end

    [assembled_permissions, revision_ids]
  end

  def sort_permissions_to_update(assembled_all_permissions:, permissions_params:)
    permissions_params ||= {}

    targets_to_add_group = []
    targets_to_update_perms = []
    targets_to_remove_group = []
    targets_to_delete = []
    targets_to_skip = []

    assembled_all_permissions.each do |target, acl_info|
      if acl_info['matched_to_group'] # group is currently in the target acl
        if acl_info['granted_permissions'] == permissions_params[target]
          # permissions are the same, do nothing
          targets_to_skip << target
        elsif permissions_params[target] == [] && acl_info['num_groups'] > 1
          # removing permissions to the target, need to remove the group from the acl
          targets_to_remove_group << target
        elsif permissions_params[target] == [] && acl_info['num_groups'] == 1
          # removing permissions, but group is only group in the acl, need to delete the acl
          targets_to_delete << target
        elsif acl_info['granted_permissions'] != permissions_params[target]
          # group is in the acl, but permissions need to be changed
          targets_to_update_perms << target
        end
      elsif permissions_params.keys.include?(target)
        # there is an acl for the target, but it does not have the group so need to add group
        targets_to_add_group << target
      end
    end

    all_update_perms = targets_to_skip + targets_to_remove_group + targets_to_update_perms + targets_to_add_group + targets_to_delete
    # need to create any target permissions not in existing permissions
    targets_to_create = permissions_params.keys - all_update_perms

    [targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete]
  end

  # sort and update target permissions
  def update_target_permissions(all_permissions:, permissions_params:, targets_to_add_group: [], targets_to_update_perms: [], targets_to_remove_group: [], type:, group_id:, successes: [], fails: [], overwrite_fails: [], revision_ids: {})
    identity_type = "#{type}_identity"

    all_permissions.each do |full_perm|
      concept_id = full_perm['concept_id']
      acl_object = full_perm.fetch('acl', {})
      target = acl_object.fetch(identity_type, {}).fetch('target', nil)
      new_perms = permissions_params[target] || []
      if targets_to_add_group.include?(target)
        new_perm_obj = edit_permission_object(
                         permission_object: acl_object,
                         action: 'add',
                         new_permissions: new_perms,
                         group_id: group_id
                       )
      elsif targets_to_remove_group.include?(target)
        new_perm_obj = edit_permission_object(
                         permission_object: acl_object,
                         action: 'remove',
                         new_permissions: new_perms,
                         group_id: group_id
                       )
      elsif targets_to_update_perms.include?(target)
        new_perm_obj = edit_permission_object(
                         permission_object: acl_object,
                         action: 'replace',
                         new_permissions: new_perms,
                         group_id: group_id
                       )
      end

      next unless new_perm_obj

      update_permission(
        acl_object: new_perm_obj,
        concept_id: concept_id,
        identity_type: identity_type,
        target: target,
        successes: successes,
        fails: fails,
        overwrite_fails: overwrite_fails,
        revision_id: revision_ids[target]
      )
    end
  end

  def update_permission(acl_object:, concept_id:, identity_type:, target:, successes: [], fails: [], overwrite_fails:[], revision_id: nil)
    log_target = target
    log_target = "#{current_user.provider_id} #{target}" if identity_type == 'provider_identity'
    update_permission_response = cmr_client.update_permission(acl_object, concept_id, token, revision_id)
    if update_permission_response.success?
      Rails.logger.info("#{identity_type.titleize} for target #{log_target} successfully updated by #{current_user}")
      successes << target
    else
      Rails.logger.error("Update #{identity_type.titleize} for target #{log_target} error: #{update_permission_response.clean_inspect}")
      update_permission_response.errors.each do |error|
        if error.include?('Expected revision-id of')
          overwrite_fails << target
          return
        end
      end
      fails << target
    end
  end

  def edit_permission_object(permission_object:, action:, new_permissions:, group_id:)
    if action == 'remove'
      permission_object['group_permissions'] = permission_object.fetch('group_permissions', []).reject { |group_perm| group_perm['group_id'] == group_id }
    elsif action == 'add'
      permission_object['group_permissions'] << { 'group_id' => group_id, 'permissions' => new_permissions }
    elsif action == 'replace'
      # run remove then add
      permission_object = edit_permission_object(
                            permission_object: permission_object,
                            action: 'remove',
                            new_permissions: new_permissions,
                            group_id: group_id
                          )
      permission_object = edit_permission_object(
                            permission_object: permission_object,
                            action: 'add',
                            new_permissions: new_permissions,
                            group_id: group_id
                          )
    end

    permission_object
  end

  def create_target_permissions(targets_to_create:, permissions_params:, identity_type:, group_id:, successes: [], fails: [])
    permissions_to_create = permissions_params.present? ? permissions_params.select { |target, _perms| targets_to_create.include?(target) } : []

    permissions_to_create.each do |target, perms|
      new_perm = construct_permission_object(
                   group_id: group_id,
                   permissions: perms,
                   target: target,
                   identity_type: identity_type
                 )

      new_perm_response = cmr_client.add_group_permissions(new_perm, token)

      log_target = target
      log_target = "#{current_user.provider_id} #{target}" if identity_type == 'provider_identity'

      if new_perm_response.success?
        Rails.logger.info("Create #{identity_type.titleize} ACL for #{log_target} successfully created by #{current_user.urs_uid}")
        successes << target
      else
        Rails.logger.error("Create #{identity_type.titleize} ACL for #{log_target} error: #{new_perm_response.clean_inspect}")
        fails << target
      end
    end
  end

  def construct_permission_object(group_id:, permissions:, target:, identity_type:)
    new_perm = {
      'group_permissions' => [{
          'group_id' => group_id,
          'permissions' => permissions
      }]
    }

    acl_identity = { 'target' => target }
    case identity_type
    when 'provider_identity'
      # provider identity acls require a provider_id
      acl_identity['provider_id'] = current_user.provider_id
    # when 'catalog_item_identity'
      # TODO try to have catalog item acls use this method
    end

    new_perm[identity_type] = acl_identity

    new_perm
  end

  def delete_target_permissions(targets_to_delete:, assembled_permissions:, identity_type:, successes: [], fails: [], overwrite_fails: [], revision_ids: {})
    permissions_to_delete = {}
    targets_to_delete.each { |perm| permissions_to_delete[perm] = assembled_permissions.fetch(perm, {}).fetch('permission_concept_id') }

    permissions_to_delete.each do |target, concept_id|
      delete_response = cmr_client.delete_permission(concept_id, token, revision_ids[target])

      log_target = target
      log_target = "#{current_user.provider_id} #{target}" if identity_type == 'provider_identity'

      if delete_response.success?
        Rails.logger.info("#{identity_type.titleize} Identity ACL for #{log_target} successfully deleted by #{current_user.urs_uid}")
        successes << target
      else
        delete_response.errors.each do |error|
          if error.include?('Expected revision-id of')
            overwrite_fails << target
            return
          end
        end
        Rails.logger.error("Delete #{identity_type.titleize} Identity ACL for #{log_target} error: #{delete_response.clean_inspect}")
        fails << target
      end
    end
  end
end
