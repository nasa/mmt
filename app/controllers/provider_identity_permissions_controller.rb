class ProviderIdentityPermissionsController < ManagePermissionsController

  RESULTS_PER_PAGE = 25

  def index
    # initialize empty group list
    @groups = []

    # default the page to 1
    page = params.fetch('page', 1).to_i
    # prevent error with page_entries_info when page < 1 and @groups = []
    page = 1 if page < 1

    # filters for groups
    # we ask for system groups, because in PUMP these ACLs can be set for system groups
    # but if the user does not have the right permissions they will not be in the response
    filters = {
      # provider: current_user.provider_id,
      provider: [current_user.provider_id, 'CMR'],
      page_size: RESULTS_PER_PAGE,
      page_num: page
    }

    # groups_response = cmr_client.get_cmr_groups(filters, token)
    groups_response = cmr_client.get_cmr_groups(filters, 'access_token_admin')

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
    @group = {}
    # group_provider_permissions_list = get_provider_permissions(@group_id)
    group_provider_permissions_list = get_permissions_for_identity_type('provider', @group_id)
    # assemble group permissions
    # @group_provider_permissions = assemble_permissions_for_table(group_provider_permissions_list, @group_id)
    @group_provider_permissions = assemble_permissions_for_table(group_provider_permissions_list, 'provider', @group_id)

    # group_response = cmr_client.get_group(@group_id, token)
    group_response = cmr_client.get_group(@group_id, 'access_token_admin')
    if group_response.success?
      @group = group_response.body
    else
      Rails.logger.error("Retrieve Group Error: #{group_response.inspect}")
      flash[:error] = Array.wrap(group_response.body['errors'])[0]
    end
  end

  def update
    @group_id = params[:id]
    permissions_params = params[:provider_permissions]
    redirect_to provider_identity_permissions_path and return if permissions_params.nil?

    permissions_params.each { |_target, perms| perms.delete('') }
    # full_provider_permissions = get_provider_permissions
    all_provider_permissions = get_permissions_for_identity_type('provider')
    selective_provider_permission_info = assemble_permissions_for_updating(all_provider_permissions, 'provider', @group_id)

    targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete = sort_permissions_to_update(selective_provider_permission_info, permissions_params)

    successes = []
    fails = []

    create_permissions(targets_to_create, permissions_params, 'provider', @group_id, successes, fails)
    delete_permissions(targets_to_delete, selective_provider_permission_info, 'provider', successes, fails)
    update_permissions(all_provider_permissions, permissions_params, targets_to_add_group, targets_to_update_perms, targets_to_remove_group, 'provider', @group_id, successes, fails)

    flash[:success] = 'Provider Object Permissions were saved.' unless successes.blank?
    flash[:error] = "#{fails.join(', ')} permissions were unable to be saved." unless fails.blank?

    redirect_to provider_identity_permissions_path
  end

  private

  # def get_provider_permissions(group = nil)
  #   provider_permissions = []
  #
  #   options = { 'include_full_acl' => 'true',
  #               'identity_type' => 'provider',
  #               'page_size' => 100, # TODO: what is the appropriate number???
  #               'provider' => current_user.provider_id }
  #   options['permitted_group'] = group if group
  #
  #   provider_permissions_response = cmr_client.get_permissions(options, token)
  #   if provider_permissions_response.success?
  #     provider_permissions = provider_permissions_response.body['items']
  #   else
  #     Rails.logger.error("Get Provider Object Permissions Error: #{provider_permissions_response.inspect}")
  #     flash[:error] = Array.wrap(provider_permissions_response.body['errors'])[0]
  #   end
  #
  #   provider_permissions
  # end

  # def assemble_permissions_for_table(permissions, group_id)
  #   assembled_permissions = {}
  #
  #   permissions.each do |perm| # permissions for provider and group
  #     target = perm['acl']['provider_identity']['target']
  #     group_permission = perm['acl']['group_permissions'].select { |group_perm| group_perm['group_id'] == group_id }
  #     granted_permissions = group_permission[0]['permissions']
  #
  #     assembled_permissions[target] = granted_permissions
  #   end
  #
  #   assembled_permissions
  # end

  # def assemble_permissions_for_updating(full_permissions, group_id)
  #   assembled_permissions = {}
  #
  #   full_permissions.each do |perm| # all permissions for provider
  #     permission_concept_id = perm['concept_id']
  #     target = perm['acl']['provider_identity']['target']
  #     group_perms = perm['acl']['group_permissions']
  #     num_groups_in_permission = group_perms.count
  #
  #     matching_group_permission = group_perms.select { |group_perm| group_perm['group_id'] == group_id }
  #     if matching_group_permission.blank?
  #       matched_to_group = false
  #       granted_permissions = []
  #     else
  #       matched_to_group = true
  #       granted_permissions = matching_group_permission[0]['permissions']
  #     end
  #
  #     assembled_permissions[target] = {
  #       'permission_concept_id' => permission_concept_id,
  #       'num_groups' => num_groups_in_permission,
  #       'matched_to_group' => matched_to_group,
  #       'granted_permissions' => granted_permissions
  #     }
  #   end
  #
  #   assembled_permissions
  # end

  # def sort_permissions_to_update(selective_provider_permission_info, permissions_params)
  #   targets_to_add_group = []
  #   targets_to_update_perms = []
  #   targets_to_remove_group = []
  #   targets_to_delete = []
  #   targets_to_skip = []
  #
  #   selective_provider_permission_info.each do |target, acl_info|
  #     if acl_info['matched_to_group'] # group is currently in the provider target acl
  #       if acl_info['granted_permissions'] == permissions_params[target]
  #         # permissions are the same, do nothing
  #         targets_to_skip << target
  #       elsif permissions_params[target] == [] && acl_info['num_groups'] > 1
  #         # removing permissions to the target, need to remove the group from the acl
  #         targets_to_remove_group << target
  #       elsif permissions_params[target] == [] && acl_info['num_groups'] == 1
  #         # removing permissions, but group is only group in the acl, need to delete the acl
  #         targets_to_delete << target
  #       elsif acl_info['granted_permissions'] != permissions_params[target]
  #         # group is in the acl, but permissions need to be changed
  #         targets_to_update_perms << target
  #       end
  #     else # there is an acl for the provider and target, but it does not have the group
  #       # provider acl exists for target, but group is not in it so need to add group
  #       targets_to_add_group << target if permissions_params.keys.include?(target)
  #     end
  #   end
  #
  #   all_update_perms = perms_to_skip + targets_to_remove_group + targets_to_update_perms + targets_to_add_group + targets_to_delete
  #   # need to create any target permissions not in existing permissions
  #   targets_to_create = permissions_params.keys - all_update_perms
  #
  #   [targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete]
  # end

  # check if has provider acl mgmt permissions
  # what if have no provider acl permissions - redirect? flash? # => don't show link
  # what if have provider acl permissions for another provider? # => show link. have modal for changing current user and redirect
  # redirect back to manage cmr page if don't have provider acl permissions for the provider

  # TODO: what check to do if we are doing provider permissions?

  def redirect_unless_current_provider_acl_admin
    check_if_current_provider_acl_administrator
    redirect_to manage_cmr_path unless @user_is_current_provider_acl_admin
  end
end
