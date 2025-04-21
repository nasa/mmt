module ManageCmr
  class ProviderIdentityPermissionsController < ManageCmrController
    include PermissionManagement

    before_action :redirect_unless_current_provider_acl_admin, only: [:index, :edit, :update]

    add_breadcrumb 'Provider Object Permissions', :provider_identity_permissions_path

    RESULTS_PER_PAGE = 25

    def index
      permitted = params.to_unsafe_h unless params.nil? # need to understand what this is doing more, think related to nested parameters not permitted.

      # default the page to 1
      page = permitted.fetch('page', 1).to_i
      # prevent error with page_entries_info when page < 1 and @groups = []
      page = 1 if page < 1

      # filters for groups
      # we ask for system groups, because in PUMP these ACLs can be set for system groups
      # but if the user does not have the right permissions they will not be in the response
      filters = {
        page_size: RESULTS_PER_PAGE,
        page_num: page,
        'provider' => [current_user.provider_id, 'CMR']
      }

      groups_response = cmr_client.get_edl_groups(filters)

      group_list = if groups_response.success?
                    groups_response.body.fetch('items', [])
                  else
                    Rails.logger.error("Get Cmr Groups Error: #{groups_response.clean_inspect}")
                    flash[:error] = groups_response.error_message
                    []
                  end

      @groups = Kaminari.paginate_array(group_list, total_count: groups_response.body.fetch('hits', 0)).page(page).per(RESULTS_PER_PAGE)
    end

    def edit
      @redirect_to = params[:redirect_to]

      @group_id = params[:id]
      @group = {}
      group_provider_permissions_list = get_permissions_for_identity_type(type: 'provider')

      # assemble provider permissions for the table of checkboxes
      @group_provider_permissions, @revision_ids = assemble_permissions_for_table(permissions: group_provider_permissions_list, type: 'provider', group_id: @group_id)

      group_response = cmr_client.get_edl_group(@group_id)
      if group_response.success?
        @group = group_response.body

        add_breadcrumb @group.fetch('name', 'No Name'), group_path(@group_id)
        add_breadcrumb 'Edit', provider_identity_permissions_path(@group_id)
      else
        Rails.logger.error("Retrieve Group to Edit Provider Identity Permissions Error: #{group_response.clean_inspect}")
        flash[:error] = group_response.error_message
      end
    end

    def update
      @group_id = params[:id]
      permissions_params = params[:provider_permissions] || {}
      overwrite_fails = []

      permissions_params&.each { |_target, perms| perms.delete('') }
      all_provider_permissions = get_permissions_for_identity_type(type: 'provider')
      # assemble permissions so they can be sorted and updated
      selective_provider_permission_info, revision_ids = assemble_permissions_for_updating(
                                            full_permissions: all_provider_permissions,
                                            type: 'provider',
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
          selective_provider_permission_info.delete(key)
        end
      end

      targets_to_add_group, targets_to_update_perms, targets_to_remove_group, targets_to_create, targets_to_delete = sort_permissions_to_update(assembled_all_permissions: selective_provider_permission_info, permissions_params: permissions_params)
      next_revision_ids = {}
      (targets_to_add_group + targets_to_update_perms + targets_to_remove_group + targets_to_delete).each do |target|
        next_revision_ids[target] = (Integer(params["#{target}_revision_id"]) + 1).to_s
      end
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
        fails: fails,
        overwrite_fails: overwrite_fails,
        revision_ids: next_revision_ids
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
        fails: fails,
        overwrite_fails: overwrite_fails,
        revision_ids: next_revision_ids
      )

      flash[:success] = successes.join(', ').titleize + ' permissions were saved.' unless successes.blank?

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
