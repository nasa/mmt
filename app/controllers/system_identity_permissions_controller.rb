class SystemIdentityPermissionsController < ManageCmrController
  include PermissionManagement

  before_filter :redirect_unless_system_acl_admin, only: [:index, :edit, :update]

  add_breadcrumb 'System Object Permissions', :system_identity_permissions_path

  RESULTS_PER_PAGE = 25

  def index
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

    group_list = if groups_response.success?
                   groups_response.body.fetch('items', [])
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
    group_system_permissions_list = get_permissions_for_identity_type(type: 'system', group_id: @group_id)

    # assemble system permissions for the table of checkboxes
    @group_system_permissions = assemble_permissions_for_table(permissions: group_system_permissions_list, type: 'system', group_id: @group_id)

    # get assembled group management permissions for table
    @group_management_permissions = set_group_management_permissions_for_table(@group_id)

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
    permissions_params = params[:system_permissions]
    group_management_params = params[:group_management]

    redirect_to system_identity_permissions_path and return if permissions_params.nil? && group_management_params.nil?

    permissions_params ||= {} # permissions_params might be nil even if group_management_params are not
    permissions_params.each { |_target, perms| perms.delete('') } unless permissions_params.nil?
    all_system_permissions = get_permissions_for_identity_type(type: 'system')
    # assemble permissions so they can be sorted and updated
    selective_full_system_permission_info = assemble_permissions_for_updating(
                                              full_permissions: all_system_permissions,
                                              type: 'system',
                                              group_id: @group_id
                                            )

    targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete = sort_permissions_to_update(assembled_all_permissions: selective_full_system_permission_info, permissions_params: permissions_params)

    successes = []
    fails = []

    create_target_permissions(
      targets_to_create: targets_to_create,
      permissions_params: permissions_params,
      identity_type: 'system_identity',
      group_id: @group_id,
      successes: successes,
      fails: fails
    )
    delete_target_permissions(
      targets_to_delete: targets_to_delete,
      assembled_permissions: selective_full_system_permission_info,
      identity_type: 'system_identity',
      successes: successes,
      fails: fails
    )
    update_target_permissions(
      all_permissions: all_system_permissions,
      permissions_params: permissions_params,
      targets_to_add_group: targets_to_add_group,
      targets_to_update_perms: targets_to_update_perms,
      targets_to_remove_group: targets_to_remove_group,
      type: 'system',
      group_id: @group_id,
      successes: successes,
      fails: fails
    )

    group_management_params.each { |_concept, perms| perms.delete('') } unless group_management_params.nil?
    all_group_management_permissions_list = get_permissions_for_identity_type(type: 'single_instance')
    group_management_perms_to_update = assemble_new_group_management_perms(
                                        all_group_management_perms: all_group_management_permissions_list,
                                        group_management_params: group_management_params,
                                        group_id: @group_id
                                       )
    update_group_management_permissions(
      group_management_perms: group_management_perms_to_update,
      successes: successes,
      fails: fails
    )

    flash[:success] = 'System Object Permissions were saved.' unless successes.blank?
    flash[:error] = "#{fails.join(', ')} permissions were unable to be saved." unless fails.blank?

    redirect_to system_identity_permissions_path
  end
end
