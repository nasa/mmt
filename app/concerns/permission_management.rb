# These methods are used by both SystemIdentityPermissionsController and
# ProviderIdentityPermissionsController. Eventually we will migrate these methods
# to a class/module for Cmr
module PermissionManagement
  extend ActiveSupport::Concern

  # for the methods below, some require type (i.e. 'provider' or 'system') and
  # some require identity_type (i.e. 'provider_identity' or 'system_identity')
  def get_permissions_for_identity_type(type, group = nil)
    permissions_list = []

    options = { 'include_full_acl' => true,
                'identity_type' => type,
                'page_size' => 50
              }
    options['permitted_group'] = group if group
    options['provider'] = current_user.provider_id if type == 'provider'

    permissions_response = cmr_client.get_permissions(options, token)
    if permissions_response.success?
      permissions_list = permissions_response.body['items']
    else
      Rails.logger.error("Get #{type.capitalize} Identity Permissions Error: #{permissions_response.inspect}")
      flash[:error] = Array.wrap(permissions_response.body['errors'])[0]
    end

    permissions_list
  end

  def assemble_permissions_for_table(permissions, type, group_id)
    assembled_permissions = {}

    identity_type = "#{type}_identity"
    permissions.each do |perm|
      target = perm.fetch('acl', {}).fetch(identity_type, {}).fetch('target', nil)

      group_permission = perm.fetch('acl', {}).fetch('group_permissions', []).select { |group_perm| group_perm['group_id'] == group_id }
      granted_permissions = group_permission[0].fetch('permissions', [])

      assembled_permissions[target] = granted_permissions
    end

    assembled_permissions
  end

  def assemble_permissions_for_updating(full_permissions, type, group_id)
    assembled_permissions = {}

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
    end

    assembled_permissions
  end

  def sort_permissions_to_update(selective_full_permission_info, permissions_params)
    targets_to_add_group = []
    targets_to_update_perms = []
    targets_to_remove_group = []
    targets_to_delete = []
    targets_to_skip = []

    selective_full_permission_info.each do |target, acl_info|
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
      else
        # there is an acl for the target, but it does not have the group so need to add group
        targets_to_add_group << target if permissions_params.keys.include?(target)
      end
    end

    all_update_perms = targets_to_skip + targets_to_remove_group + targets_to_update_perms + targets_to_add_group + targets_to_delete
    # need to create any target permissions not in existing permissions
    targets_to_create = permissions_params.keys - all_update_perms

    [targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete]
  end

  def update_permissions(all_permissions, permissions_params, targets_to_add_group, targets_to_update_perms, targets_to_remove_group, type, group_id, successes, fails)
    identity_type = "#{type}_identity"

    all_permissions.each do |full_perm|
      concept_id = full_perm['concept_id']
      acl_object = full_perm.fetch('acl', {})
      target = acl_object.fetch(identity_type, {}).fetch('target', nil)
      new_perms = permissions_params[target]
      if targets_to_add_group.include?(target)
        new_perm_obj = edit_permission_object(acl_object, 'add', new_perms, group_id)
      elsif targets_to_remove_group.include?(target)
        new_perm_obj = edit_permission_object(acl_object, 'remove', new_perms, group_id)
      elsif targets_to_update_perms.include?(target)
        new_perm_obj = edit_permission_object(acl_object, 'replace', new_perms, group_id)
      end

      next unless new_perm_obj

      update_permission_response = cmr_client.update_permission(new_perm_obj, concept_id, token)
      log_target = target
      log_target = "#{current_user.provider_id} #{target}" if type == 'provider'
      if update_permission_response.success?
        Rails.logger.info("#{type.capitalize} Identity ACL for #{log_target} successfully updated by #{current_user}")
        successes << target
      else
        Rails.logger.error("Update #{type.capitalize} Identity ACL for #{log_target} error: #{update_permission_response.inspect}")
        fails << target
      end
    end
  end

  def edit_permission_object(perm_object, action, new_perms, group_id)
    if action == 'remove'
      perm_object['group_permissions'] = perm_object['group_permissions'].reject { |group_perm| group_perm['group_id'] == group_id }
    elsif action == 'add'
      perm_object['group_permissions'] << { 'group_id' => group_id, 'permissions' => new_perms }
    elsif action == 'replace'
      # run remove then add
      perm_object = edit_permission_object(perm_object, 'remove', new_perms, group_id)
      perm_object = edit_permission_object(perm_object, 'add', new_perms, group_id)
    end

    perm_object
  end

  def create_permissions(targets_to_create, permissions_params, type, group_id, successes, fails)

    permissions_to_create = permissions_params.select { |target, _perms| targets_to_create.include?(target) }

    new_permissions = construct_new_permission_objects(permissions_to_create, type, group_id)
    identity_type = "#{type}_identity"
    new_permissions.each do |new_perm|
      new_perm_response = cmr_client.add_group_permissions(new_perm, token)

      target = new_perm.fetch(identity_type, {}).fetch('target', nil)
      log_target = target
      log_target = "#{current_user.provider_id} #{target}" if type == 'provider'

      if new_perm_response.success?
        Rails.logger.info("Create #{type.capitalize} Identity ACL for #{log_target} successfully created by #{current_user.urs_uid}")
        successes << target
      else
        Rails.logger.error("Create #{type.capitalize} Identity ACL for #{log_target} error: #{new_perm_response.inspect}")
        fails << target
      end
    end
  end

  def construct_new_permission_objects(permissions, type, group_id)
    permission_objects = []

    identity_type = "#{type}_identity"
    permissions.each do |target, perms|
      new_perm = {
        'group_permissions' => [{
          'group_id' => group_id,
          'permissions' => perms
        }],
        identity_type => {
          'target' => target
        }
      }
      new_perm[identity_type]['provider_id'] = current_user.provider_id if type == 'provider'

      permission_objects << new_perm
    end

    permission_objects
  end

  def delete_permissions(targets_to_delete, selective_full_permission_info, type, successes, fails)
    permissions_to_delete = {}
    targets_to_delete.each { |perm| permissions_to_delete[perm] = selective_full_permission_info.fetch(perm, {}).fetch('permission_concept_id') }

    permissions_to_delete.each do |target, concept_id|
      delete_response = cmr_client.delete_permission(concept_id, token)

      log_target = target
      log_target = "#{current_user.provider_id} #{target}" if type == 'provider'

      if delete_response.success?
        Rails.logger.info("#{type.capitalize} Identity ACL for #{log_target} successfully deleted by #{current_user.urs_uid}")
        successes << target
      else
        Rails.logger.error("Delete #{type.capitalize} Identity ACL for #{log_target} error: #{delete_response.inspect}")
        fails << target
      end
    end
  end
end