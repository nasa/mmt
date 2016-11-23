class SystemIdentityPermissionsController < ManageCmrController
  before_filter :redirect_unless_system_acl_admin, only: [:index, :edit, :update]

  RESULTS_PER_PAGE = 25

  def index
    # Initialize an empty group list
    @groups = []

    # Default the page to 1
    page = params.fetch('page', 1).to_i

    # Prevent the page from being less than 1
    page = 1 if page < 1

    # Filters to provide CMR
    filters = {
      provider: 'CMR',
      page_size: RESULTS_PER_PAGE,
      page_num: page
    }

    groups_response = cmr_client.get_cmr_groups(filters, token)

    if groups_response.success?
      group_list = groups_response.body.fetch('items', [])

      @groups = Kaminari.paginate_array(group_list, total_count: groups_response.body.fetch('hits', 0)).page(page).per(RESULTS_PER_PAGE)
    else
      Rails.logger.error("Get Cmr Groups Error: #{groups_response.inspect}")
      flash[:error] = Array.wrap(groups_response.body['errors'])[0]
    end
  end

  def edit
    @group_id = params[:id]
    group_system_permissions = get_system_permissions(@group_id)
    @group_system_permissions_hash = assemble_permissions_for_table(group_system_permissions, @group_id)

    group_response = cmr_client.get_group(@group_id, token)
    if group_response.success?
      @group = group_response.body
    else
      Rails.logger.error("Retrieve Group Error: #{group_response.inspect}")
      flash[:error] = Array.wrap(group_response.body['errors'])[0]
    end
  end

  def update
    @group_id = params[:id]
    permissions_params = params[:system_permissions]
    permissions_params.each { |_target, perms| perms.delete('') }
    full_system_permissions = get_system_permissions
    selective_full_system_permission_info = assemble_permissions_for_updating(full_system_permissions, @group_id)

    targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete = sort_permissions_to_update(selective_full_system_permission_info, permissions_params)

    successes = []
    fails = []

    create_permissions(targets_to_create, permissions_params, @group_id, successes, fails)
    delete_permissions(targets_to_delete, selective_full_system_permission_info, successes, fails)
    update_permissions(full_system_permissions, permissions_params, targets_to_add_group, targets_to_update_perms, targets_to_remove_group, @group_id, successes, fails)

    flash[:success] = 'System Object Permissions were saved.' unless successes.blank?
    flash[:error] = "#{fails.join(', ')} permissions were unable to be saved." unless fails.blank?

    redirect_to system_identity_permissions_path
  end

  private

  def get_system_permissions(group = nil)
    system_permissions = []

    options = { 'include_full_acl' => 'true',
                'identity_type' => 'system',
                'page_size' => 30 }
    options['permitted_group'] = group if group

    system_permissions_response = cmr_client.get_permissions(options, token)
    if system_permissions_response.success?
      system_permissions = system_permissions_response.body['items']
    else
      Rails.logger.error("Get System Object Permissions Error: #{system_permissions_response.inspect}")
      flash[:error] = Array.wrap(system_permissions_response.body['errors'])[0]
    end

    system_permissions
  end

  def assemble_permissions_for_table(permissions, group_id)
    assembled_permissions = {}

    permissions.each do |perm|
      permission_concept_id = perm['concept_id'] # not yet used
      target = perm['acl']['system_identity']['target']
      group_permission = perm['acl']['group_permissions'].select { |group_perm| group_perm['group_id'] == group_id }
      granted_permissions = group_permission[0]['permissions'] # || []
      assembled_permissions[target] = { 'permission_concept_id' => permission_concept_id,
                                        'permissions' => granted_permissions }
    end

    assembled_permissions
  end

  def assemble_permissions_for_updating(full_permissions, group_id)
    assembled_permissions = {}

    full_permissions.each do |perm|
      permission_concept_id = perm['concept_id']
      target = perm['acl']['system_identity']['target']
      group_perms = perm['acl']['group_permissions']
      num_groups_in_permission = group_perms.count

      matching_group_permission = group_perms.select { |group_perm| group_perm['group_id'] == group_id }
      if matching_group_permission.blank?
        matched_to_group = false
        granted_permissions = []
      else
        matched_to_group = true
        granted_permissions = matching_group_permission[0]['permissions']
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

  def sort_permissions_to_update(selective_system_permission_info, permissions_params)
    targets_to_add_group = []
    targets_to_update_perms = []
    targets_to_remove_group = []
    targets_to_delete = []
    perms_to_skip = []

    selective_system_permission_info.each do |target, acl_info|
      if acl_info['matched_to_group'] # group is currently in the system acl
        if acl_info['granted_permissions'] == permissions_params[target]
          # permissions are the same, do nothing
          perms_to_skip << target
        elsif permissions_params[target] == [] && acl_info['num_groups'] > 1
          # removing the permissions, need to remove the group from the system acl
          targets_to_remove_group << target
        elsif permissions_params[target] == [] && acl_info['num_groups'] == 1
          targets_to_delete << target
        elsif acl_info['granted_permissions'] != permissions_params[target]
          # group is in system acl, but permissions need to be changed
          targets_to_update_perms << target
        end
      else # system target acl does not have the group
        # system acl exists for target, but does not have group so needs to be added
        targets_to_add_group << target if permissions_params.keys.include?(target)
      end
    end

    all_update_perms = perms_to_skip + targets_to_remove_group + targets_to_update_perms + targets_to_add_group + targets_to_delete
    # need to create any system target permissions not in existing system permissions
    targets_to_create = permissions_params.keys - all_update_perms

    [targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete]
  end

  def update_permissions(full_system_permissions, permissions_params, targets_to_add_group, targets_to_update_perms, targets_to_remove_group, group_id, successes, fails)
    full_system_permissions.each do |full_perm|
      concept_id = full_perm['concept_id']
      acl_object = full_perm['acl']
      target = acl_object['system_identity']['target']
      new_perms = permissions_params[target]
      if targets_to_add_group.include?(target)
        new_perm_obj = edit_permission_object(acl_object, 'add', new_perms, group_id)
      elsif targets_to_remove_group.include?(target)
        new_perm_obj = edit_permission_object(acl_object, 'remove', new_perms, group_id)
      elsif targets_to_update_perms.include?(target)
        new_perm_obj = edit_permission_object(acl_object, 'replace', new_perms, group_id)
      end

      next unless new_perm_obj

      update_perm_response = cmr_client.update_permission(new_perm_obj, concept_id, token)
      if update_perm_response.success?
        successes << target
      else
        Rails.logger.error("update system acl error: #{update_perm_response.inspect}")
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

  def create_permissions(targets_to_create, permissions_params, group_id, successes, fails)
    permissions_to_create = permissions_params.select { |target, _perms| targets_to_create.include?(target) }
    new_permissions = construct_new_permission_objects(permissions_to_create, group_id)

    new_permissions.each do |new_perm|
      new_perm_response = cmr_client.add_group_permissions(new_perm, token)
      if new_perm_response.success?
        successes << new_perm['system_identity']['target']
      else
        Rails.logger.error("create system acl error: #{new_perm_response.inspect}")
        fails << new_perm['system_identity']['target']
      end
    end
  end

  def construct_new_permission_objects(permissions, group_id)
    permission_objects = []

    permissions.each do |target, perms|
      new_perm = {
        'group_permissions' => [{
          'group_id' => group_id,
          'permissions' => perms
        }],
        'system_identity' => {
          'target' => target
        }
      }

      permission_objects << new_perm
    end

    permission_objects
  end

  def delete_permissions(targets_to_delete, selective_full_system_permission_info, successes, fails)
    permissions_to_delete = {}
    targets_to_delete.each { |perm| permissions_to_delete[perm] = selective_full_system_permission_info[perm]['permission_concept_id'] }

    permissions_to_delete.each do |target, concept_id|
      delete_response = cmr_client.delete_permission(concept_id, token)
      if delete_response.success?
        successes << target
      else
        Rails.logger.error("delete system acl error: #{delete_response.inspect}")
        fails << target
      end
    end
  end

  def redirect_unless_system_acl_admin
    check_if_system_acl_administrator
    redirect_to manage_cmr_path unless @user_is_system_acl_admin
  end
end
