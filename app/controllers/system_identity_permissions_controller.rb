class SystemIdentityPermissionsController < ManagePermissionsController
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
    @group = {}
    group_system_permissions_list = get_permissions_for_identity_type('system', @group_id)

    # assemble system permissions for the table of checkboxes
    @group_system_permissions = assemble_permissions_for_table(group_system_permissions_list, 'system', @group_id)

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
    permissions_params = params[:system_permissions] # || [{}] # need to try to recreate
    redirect_to system_identity_permissions_path and return if permissions_params.nil?

    permissions_params.each { |_target, perms| perms.delete('') }
    all_system_permissions = get_permissions_for_identity_type('system')
    # assemble permission so they can be sorted and updated
    selective_full_system_permission_info = assemble_permissions_for_updating(all_system_permissions, 'system', @group_id)

    targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete = sort_permissions_to_update(selective_full_system_permission_info, permissions_params)

    successes = []
    fails = []

    create_permissions(targets_to_create, permissions_params, 'system', @group_id, successes, fails)
    delete_permissions(targets_to_delete, selective_full_system_permission_info, 'system', successes, fails)
    update_permissions(all_system_permissions, permissions_params, targets_to_add_group, targets_to_update_perms, targets_to_remove_group, 'system', @group_id, successes, fails)

    flash[:success] = 'System Object Permissions were saved.' unless successes.blank?
    flash[:error] = "#{fails.join(', ')} permissions were unable to be saved." unless fails.blank?

    redirect_to system_identity_permissions_path
  end
end
