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

  # assemble_group_management_permissions_for_table
  def set_group_management_permissions(group_id)
    group_management_permissions = get_permissions_for_identity_type('single_instance', group_id)

    assembled_group_management_permissions = []

    group_management_permissions.each do |perm|
      # management_perm = {}

      target_id = perm.fetch('acl', {}).fetch('single_instance_identity', {}).fetch('target_id', nil)

      target_group_response = cmr_client.get_group(target_id, token)
      if target_group_response.success?
        target_group = target_group_response.body
        # name = target_group.fetch('name', nil)
      end

      group_permission = perm.fetch('acl', {}).fetch('group_permissions', []).select { |group_perm| group_perm['group_id'] == group_id }
      granted_permissions = group_permission[0].fetch('permissions', [])
      target_group['granted_permissions'] = granted_permissions
      target_group['concept_id'] = target_id

      # management_perm[name] = target_group

      # fail
      # assembled_group_management_permissions << management_perm
      assembled_group_management_permissions << target_group
    end

    assembled_group_management_permissions
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

  # sort and update target permissions
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

      # make above into an update method for provider/system perms
      # make below a generic update list response
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

    new_permissions = construct_new_permissions(permissions_to_create, type, group_id)
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

  def construct_new_permissions(permissions, type, group_id)
    permission_objects = []

    identity_type = "#{type}_identity"
    permissions.each do |target, perms|
      # new_perm = {
      #   'group_permissions' => [{
      #     'group_id' => group_id,
      #     'permissions' => perms
      #   }],
      #   identity_type => {
      #     'target' => target
      #   }
      # }
      # new_perm[identity_type]['provider_id'] = current_user.provider_id if type == 'provider'

      new_perm = construct_permission_object(group_id, perms, target, type: type)

      permission_objects << new_perm
    end

    permission_objects
  end

  def construct_permission_object(group_id, perms, target, options = { type: type })
    new_perm = {
      'group_permissions' => [{
          'group_id' => group_id,
          'permissions' => perms
      }]
    }

    identity_type = "#{options[:type]}_identity"
    new_perm[identity_type] = construct_acl_identity(target, options)

    new_perm
  end

  def construct_acl_identity(target, options = {})
    # all acl identity have a target
    acl_identity = { 'target' => target }

    case options[:type]
    when 'provider'
      # provider identity acls require a provider_id
      acl_identity['provider_id'] = current_user.provider_id
    when 'single_instance'
      # single instance identity (management group) acls require a target_id
      acl_identity['target_id'] = options[:target_id]
    # when 'catalog_item'
      # TODO how to have catalog item acls use this method
    end

    acl_identity
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

  def assemble_new_group_management_perms(all_management_perms_list, management_params, group_id)
    new_management_acls = []

    all_management_perms_list.each do |perm|
      new_perm = {}

      acl = perm.fetch('acl', {})
      target_id = acl.fetch('single_instance_identity', {}).fetch('target_id', nil)

      matching_group_permission = acl.fetch('group_permissions', []).select { |group_perm| group_perm['group_id'] == group_id }
      next if matching_group_permission.blank? # current group is not one of the management groups

      current_permissions = matching_group_permission[0].fetch('permissions', [])
      new_permissions = management_params[target_id]
      next if new_permissions == current_permissions

      target_group_response = cmr_client.get_group(target_id, token)
      if target_group_response.success?
        target_group_name = target_group_response.body.fetch('name', nil)
        # name = target_group.fetch('name', nil)
      end

      matching_group_permission.first['permissions'] = new_permissions
      # new_perm['target_id'] = acl
      new_perm['acl'] = acl
      new_perm['concept_id'] = perm['concept_id']
      new_perm['target_group_name'] = target_group_name
      new_perm['target_id'] = target_id

      new_management_acls << new_perm
    end

    new_management_acls
  end

  def update_group_management_permissions(new_group_management_perms, successes, fails)
    new_group_management_perms.each do |new_group_perm|
      # fail
      concept_id = new_group_perm['concept_id']
      new_acl = new_group_perm['acl']

      update_permission_response = cmr_client.update_permission(new_acl, concept_id, token)


      # log_target = target
      log_target = "#{new_group_perm['target_group_name']} (#{new_group_perm['target_id']})"
      if update_permission_response.success?
        # Rails.logger.info("#{type.capitalize} Identity ACL for #{log_target} successfully updated by #{current_user}")
        Rails.logger.info("Single Instance Identity ACL for target #{log_target} by group #{@group_id} successfully updated by #{current_user}")
        successes << "Group Management for [#{new_group_perm['target_group_name']}]"
      else
        # Rails.logger.error("Update #{type.capitalize} Identity ACL for #{log_target} error: #{update_permission_response.inspect}")
        Rails.logger.error("Update Single Instance Identity ACL for target #{log_target} by group #{@group_id} error: #{update_permission_response.inspect}")
        fails << "Group Management for [#{new_group_perm['target_group_name']}]"
      end
    end
  end
end
