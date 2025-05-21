module ManageCmr
  class SystemIdentityPermissionsController < ManageCmrController
    include PermissionManagement

    before_action :redirect_unless_system_acl_admin, only: [:index, :edit, :update]

    add_breadcrumb 'System Object Permissions', :system_identity_permissions_path

    RESULTS_PER_PAGE = 25

    def index
      permitted = params.to_unsafe_h unless params.nil? # need to understand what this is doing more, think related to nested parameters not permitted.

      # Default the page to 1
      page = permitted.fetch('page', 1).to_i

      # Prevent the page from being less than 1
      page = 1 if page < 1

      # Filters to provide CMR
      filters = {
        'provider' => ['CMR'],
        page_size: RESULTS_PER_PAGE,
        page_num: page
      }

      groups_response = cmr_client.get_edl_groups(filters)

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
      @redirect_to = params[:redirect_to]

      @group_id = params[:id]
      @group = {}
      group_system_permissions_list = get_permissions_for_identity_type(type: 'system')

      # assemble system permissions for the table of checkboxes
      @group_system_permissions, @revision_ids = assemble_permissions_for_table(permissions: group_system_permissions_list, type: 'system', group_id: @group_id)

      group_response = cmr_client.get_edl_group(@group_id)
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
      overwrite_fails = []

      permissions_params&.each { |_target, perms| perms.delete('') }
      all_system_permissions = get_permissions_for_identity_type(type: 'system')
      # assemble permissions so they can be sorted and updated
      selective_full_system_permission_info, revision_ids = assemble_permissions_for_updating(
                                                full_permissions: all_system_permissions,
                                                type: 'system',
                                                group_id: @group_id
                                              )

      # If the revision ids do not match, another user's changes would be overwritten
      # Removing it from the permissions_params and selective_full_system_permission_info
      # prevents it from being sorted into a category to be changed
      (permissions_params.keys | revision_ids.keys).each do |key|
        unless revision_ids[key]&.to_s == params["#{key}_revision_id"]
          Rails.logger.info("User #{current_user.urs_uid} attempted to modify ACL #{key} in provider #{current_user.provider_id}, but failed because another user had already made a change.")
          overwrite_fails << key
          permissions_params.delete(key)
          selective_full_system_permission_info.delete(key)
        end
      end

      targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete = sort_permissions_to_update(assembled_all_permissions: selective_full_system_permission_info, permissions_params: permissions_params)
      next_revision_ids = {}
      (targets_to_add_group + targets_to_update_perms + targets_to_remove_group + targets_to_delete).each do |target|
        next_revision_ids[target] = (Integer(params["#{target}_revision_id"]) + 1).to_s
      end
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
        fails: fails,
        overwrite_fails: overwrite_fails,
        revision_ids: next_revision_ids
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
        flash[:success] = successes.join(', ').titleize + ' permissions were saved.'
      end
      error_message = fails.join(', ').titleize
      overwrite_error_message = overwrite_fails.join(', ').titleize
      if error_message.present? && overwrite_error_message.present?
        flash[:error] = error_message + ' permissions were unable to be saved.<br>' + overwrite_error_message + ' permissions were unable to be saved because another user made changes to those permissions.'
      elsif error_message.present?
        flash[:error] = error_message + ' permissions were unable to be saved.'
      elsif overwrite_error_message.present?
        flash[:error] = overwrite_error_message + ' permissions were unable to be saved because another user made changes to those permissions.'
      end

      redirect_to params[:redirect_to]
    end
  end
end
