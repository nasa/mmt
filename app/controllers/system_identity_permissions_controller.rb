class SystemIdentityPermissionsController < ManageCmrController
  include PermissionManagement

  before_action :redirect_unless_system_acl_admin, only: [:index, :edit, :update]

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
                   Rails.logger.error("Get Cmr Groups for System Identity Permissions Error: #{groups_response.clean_inspect}")
                   flash[:error] = groups_response.error_message
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
    # assemble a hash of current revision ids
    @revision_ids = get_revisions_for_edit(type: 'system')

    group_response = cmr_client.get_group(@group_id, token)
    if group_response.success?
      @group = group_response.body

      add_breadcrumb @group.fetch('name', 'No Name'), group_path(@group_id)
      add_breadcrumb 'Edit', provider_identity_permissions_path(@group_id)
    else
      Rails.logger.error("Retrieve Group to Edit System Identity Permissions Error: #{group_response.clean_inspect}")
      flash[:error] = group_response.error_message
    end
  end

  def update
    @group_id = params[:id]
    permissions_params = params[:system_permissions] || {}

    permissions_params&.each { |_target, perms| perms.delete('') }
    all_system_permissions = get_permissions_for_identity_type(type: 'system')
    # assemble permissions so they can be sorted and updated
    selective_full_system_permission_info = assemble_permissions_for_updating(
                                              full_permissions: all_system_permissions,
                                              type: 'system',
                                              group_id: @group_id
                                            )

    targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete, targets_to_fail, target_revision_ids = sort_permissions_to_update(assembled_all_permissions: selective_full_system_permission_info, permissions_params: permissions_params, type: 'system')
    next_revision_ids = {}
    target_revision_ids.each do |key, value|
      next_revision_ids[key] = (Integer(value) + 1).to_s
    end
    successes = []
    fails = []
    overwrite_fails = targets_to_fail

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
      fails: fails,
      overwrite_fails: overwrite_fails,
      revision_ids: next_revision_ids
    )

    unless successes.blank?
      flash[:success] = (successes.reduce('') do |memo, target|
        memo += '<br>' unless memo.blank?
        memo + "'#{target.titleize}' permissions were saved"
      end).html_safe
    end
    unless fails.blank? && overwrite_fails.blank?
      error_message = fails.reduce('') do |memo, target|
        memo += '<br>' unless memo.blank?
        memo + "'#{target.titleize}' permissions were unable to be saved."
      end
      error_message = overwrite_fails.reduce(error_message) do |memo, target|
        memo += '<br>' unless memo.blank?
        memo + "'#{target.titleize}' permissions were unable to be saved because another user made changes to those permissions."
      end
      flash[:error] = error_message.html_safe
    end

    redirect_to system_identity_permissions_path
  end
end
