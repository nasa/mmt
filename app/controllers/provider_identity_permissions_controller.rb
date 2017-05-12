class ProviderIdentityPermissionsController < ManageCmrController
  include PermissionManagement

  before_filter :redirect_unless_current_provider_acl_admin, only: [:index, :edit, :update]

  add_breadcrumb 'Provider Object Permissions', :provider_identity_permissions_path

  RESULTS_PER_PAGE = 25

  def index
    # default the page to 1
    page = params.fetch('page', 1).to_i
    # prevent error with page_entries_info when page < 1 and @groups = []
    page = 1 if page < 1

    # filters for groups
    # we ask for system groups, because in PUMP these ACLs can be set for system groups
    # but if the user does not have the right permissions they will not be in the response
    filters = {
      provider: [current_user.provider_id, 'CMR'],
      page_size: RESULTS_PER_PAGE,
      page_num: page
    }

    groups_response = cmr_client.get_cmr_groups(filters, token)

    group_list = if groups_response.success?
                    group_list = groups_response.body.fetch('items', [])
                  else
                    Rails.logger.error("Get Cmr Groups Error: #{groups_response.inspect}")
                    flash[:error] = Array.wrap(groups_response.body['errors'])[0]
                    []
                  end

    @groups = Kaminari.paginate_array(group_list, total_count: groups_response.body.fetch('hits', 0)).page(page).per(RESULTS_PER_PAGE)
  end

  def edit
    @group_id = params[:id]
    @group = {}
    group_provider_permissions_list = get_permissions_for_identity_type(type: 'provider', group_id: @group_id)

    # assemble provider permissions for the table of checkboxes
    @group_provider_permissions = assemble_permissions_for_table(permissions: group_provider_permissions_list, type: 'provider', group_id: @group_id)

    group_response = cmr_client.get_group(@group_id, token)
    if group_response.success?
      @group = group_response.body

      add_breadcrumb @group.fetch('name', 'No Name'), group_path(@group_id)
      add_breadcrumb 'Edit', provider_identity_permissions_path(@group_id)
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
    all_provider_permissions = get_permissions_for_identity_type(type: 'provider')
    # assemble permissions so they can be sorted and updated
    selective_provider_permission_info = assemble_permissions_for_updating(
                                           full_permissions: all_provider_permissions,
                                           type: 'provider',
                                           group_id: @group_id
                                         )

    targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete = sort_permissions_to_update(assembled_all_permissions: selective_provider_permission_info, permissions_params: permissions_params)

    successes = []
    fails = []

    create_target_permissions(
      targets_to_create: targets_to_create,
      permissions_params: permissions_params,
      identity_type: 'provider_identity',
      group_id: @group_id,
      successes: successes,
      fails: fails
    )
    delete_target_permissions(
      targets_to_delete: targets_to_delete,
      assembled_permissions: selective_provider_permission_info,
      identity_type: 'provider_identity',
      successes: successes,
      fails: fails
    )
    update_target_permissions(
      all_permissions: all_provider_permissions,
      permissions_params: permissions_params,
      targets_to_add_group: targets_to_add_group,
      targets_to_update_perms: targets_to_update_perms,
      targets_to_remove_group: targets_to_remove_group,
      type: 'provider',
      group_id: @group_id,
      successes: successes,
      fails: fails
    )

    flash[:success] = 'Provider Object Permissions were saved.' unless successes.blank?
    flash[:error] = "#{fails.join(', ')} permissions were unable to be saved." unless fails.blank?

    redirect_to provider_identity_permissions_path
  end
end
