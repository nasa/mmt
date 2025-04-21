module ManageCmr
  # :nodoc:
  class PermissionsController < ManageCmrController
    include PermissionManagement
    include GroupsHelper

    before_action :groups_for_permissions, only: [:new, :edit, :update, :create]

    add_breadcrumb 'Collection Permissions', :permissions_path

    RESULTS_PER_PAGE = 25

    def index
      # Default the page to 1
      page = params.fetch('page', 1)

      @opts = {
        'provider'         => current_user.provider_id,
        'page_num'         => page,
        'page_size'        => RESULTS_PER_PAGE,
        'identity_type'    => 'catalog_item',
        'include_full_acl' => true
      }

      permissions_response = cmr_client.get_permissions(@opts, token)

      @permissions = if permissions_response.success?
                      permissions_response.body['items']
                    else
                      []
                    end

      @permissions = Kaminari.paginate_array(@permissions, total_count: permissions_response.body.fetch('hits', 0)).page(page).per(RESULTS_PER_PAGE)
    end

    def show
      set_collection_permission
    end

    def new
      @permission = {}

      add_breadcrumb 'New', new_permission_path
    end

    def create
      @permission = construct_request_object(current_user.provider_id)

      response = cmr_client.add_group_permissions(@permission, token)

      if response.success?
        Rails.logger.info("#{current_user.urs_uid} CREATED catalog item ACL (Collection Permission) for #{current_user.provider_id}. #{response.body}")

        redirect_to permission_path(response.body['concept_id']), flash: { success: 'Collection Permission was successfully created.' }
      else
        Rails.logger.error("Create Collection Permission Error: #{response.clean_inspect}")

        # Look up the error code. If we have a friendly version, use it. Otherwise,
        # just use the error message as it comes back from the CMR.
        permission_creation_error = PermissionsHelper::ErrorCodeMessages[response.status]
        permission_creation_error ||= response.error_message

        flash.now[:error] = permission_creation_error

        render :new
      end
    end

    def edit
      @permission = {}

      @permission_concept_id = params[:id]
      permission_response = cmr_client.get_permission(@permission_concept_id, token)

      if permission_response.success?
        @permission = permission_response.body

        add_breadcrumb @permission.fetch('catalog_item_identity', {})['name'], permission_path(@permission_concept_id)
        add_breadcrumb 'Edit', edit_permission_path(@permission_concept_id)

        # Searching for permission to get revision_id
        @opts = {
          'page_size'        => RESULTS_PER_PAGE,
          'id'               => @permission_concept_id,
          'include_full_acl' => true
        }

        permission_search_response = cmr_client.get_permissions(@opts, token)
        permission_found = permission_search_response.body.fetch('hits', 0) > 0

        if permission_search_response.success? && permission_found
          @revision_id = permission_search_response.body.fetch('items', [{}]).fetch(0, {})['revision_id']

          hydrate_groups(@permission)
        else
          @unconfirmed_revision_id = true
        end
      else
        Rails.logger.error("Error retrieving a permission: #{permission_response.clean_inspect}")
      end
    end

    def update
      @permission = {}
      @permission_concept_id = collection_permission_params[:id]
      permission_provider = collection_permission_params[:permission_provider]
      @revision_id = collection_permission_params[:revision_id]
      next_revision_id = "#{@revision_id.to_i + 1}"

      @permission = construct_request_object(permission_provider)

      update_response = cmr_client.update_permission(@permission, @permission_concept_id, token, next_revision_id)

      if update_response.success?
        Rails.logger.info("#{current_user.urs_uid} UPDATED catalog item ACL (Collection Permission) for #{permission_provider}. #{response.body}")

        redirect_to permission_path(@permission_concept_id), flash: { success: 'Collection Permission was successfully updated.' }
      else
        hydrate_groups(@permission)

        Rails.logger.error("Update Collection Permission Error: #{update_response.clean_inspect}")
        permission_update_error = update_response.error_message

        if permission_update_error == 'Permission to update ACL is denied'
          redirect_to permission_path(@permission_concept_id), flash: { error: 'You are not authorized to update permissions. Please contact your system administrator.' }
        else
          flash[:error] = permission_update_error

          render :edit
        end
      end
    end

    def destroy
      response = cmr_client.delete_permission(params[:id], token)
      if response.success?
        flash[:success] = 'Collection Permission was successfully deleted.'
        Rails.logger.info("#{current_user.urs_uid} DELETED catalog item ACL for #{current_user.provider_id}. #{response.body}")
        redirect_to permissions_path
      else
        Rails.logger.error("Delete Collection Permission Error: #{response.clean_inspect}")
        flash[:error] = response.error_message
        set_collection_permission
        render :show
      end
    end

    def download_tea_configuration
      provider = current_user.provider_id
      tea_token = token
      tea_configuration_response = cmr_client.get_tea_configuration(provider, tea_token)
      tea_configuration = tea_configuration_response.body
      if tea_configuration_response.error?
        Rails.logger.error("Error retrieving TEA configuration: #{tea_configuration_response.clean_inspect}")
        flash[:error] = tea_configuration_response.error_message
        redirect_to permissions_path
      else
        send_data tea_configuration, type: 'application/text; charset=utf-8', disposition: "attachment; filename=tea_configuration-#{Date.today}.yaml", target: '_blank'
      end
    end

    private

    def collection_permission_params
      # because there are nested params, when they go through strong parameters
      # the nested params become a ActionController Parameters object
      # so when grabbing the nested params we need to call to_h on them or some
      # hash methods will cause an error
      params.permit(:id, :permission_provider, :revision_id, :permission_name,
                    :collection_applicable, :granule_applicable, :collection_option,
                    collectionsChooser_toList: [], hidden_collections: [],
                    collection_access_value: [ :min_value, :max_value, :include_undefined_value ],
                    granule_access_value: [ :min_value, :max_value, :include_undefined_value ],
                    collection_temporal_filter: [ :start_date, :stop_date, :mask ],
                    granule_temporal_filter: [ :start_date, :stop_date, :mask ],
                    search_groups: [], search_and_order_groups: [],
                    hidden_search_groups: [], hidden_search_and_order_groups: []
      )
    end

    # Fix a bug where MMT at one point duplicated permissions.
    def unique_permissions(permissions)
      hash = {}
      set = []
      permissions.each do | permission |
        group_id = permission["group_id"]
        if group_id.nil?
          set << permission
        else
          if (hash[group_id].nil?)
            set << permission
            hash[group_id] = true
          end
        end
      end
      set
    end

    def set_collection_permission
      @permission = {}
      @permission_concept_id = params[:id]

      permission_response = cmr_client.get_permission(@permission_concept_id, token)
      if permission_response.success?
        @permission = permission_response.body
        permissions = @permission["group_permissions"]
        unless permissions.nil?
          @permission["group_permissions"] = unique_permissions(permissions)
        end
        hydrate_groups(@permission)

        add_breadcrumb @permission.fetch('catalog_item_identity', {})['name'], permission_path(@permission_concept_id)
      else
        Rails.logger.error("Error retrieving a permission: #{permission_response.clean_inspect}")
      end
    end

    # Iterates through the groups associated with the provided collection
    # and hydrates the `group` key with the group details and `is_hidden`
    # with a boolean representing the users ability to see this group
    def hydrate_groups(permission)
      group_permissions = permission.fetch('group_permissions', [])

      permission['group_permissions'] = group_permissions
      permission.fetch('group_permissions', []).each do |group_permission|
        next unless group_permission.key?('group_id')

        group_response = cmr_client.get_edl_group(group_permission['group_id'])

        if group_response.success?
          provider_id = group_response.body["tag"]
          # If this user does not have access to view this group mark it for hiding
          if provider_id == "CMR" && !policy(:system_group).read?
            group_permission['is_hidden'] = true
          end
        end

        hydrate_group_permissions(group_permission)

        group_permission['group'] = group_response.body if group_response.success?
      end
    end

    def hydrate_group_permissions(group_permission)
      # If order is given, read (search) is assumed, but this isn't always reflected in the data
      # so we'll create that data here
      group_permission.fetch('permissions', []) | ['read'] if group_permission.fetch('permissions', []).include?('order')

      # Ignore any other permissions that could be in this value from legacy data
      group_permission['permissions'].delete_if { |permission| !%w(read order).include?(permission) }
    end

    # CMR requires that these values be as primitive values instead of string
    # so we'll convert the few values we need to before sending to the API
    def hydrate_constraint_values(constraints)
      constraints.each do |key, val|
        constraints[key] = if val == 'true'
                            true
                          else
                            val.to_f
                          end
      end
    end

    def get_groups
      filters = {
        'provider'  => current_user.provider_id
      }

      # get groups for provider AND System Groups if user has Read permissions on System Groups
      filters['provider'] = [current_user.provider_id, 'CMR'] if policy(:system_group).read?

      # Retrieve the first page of groups
      groups_response = cmr_client.get_edl_groups(filters, false)

      all_groups = []
      all_groups = groups_response.body['items'] unless groups_response.error? || groups_response.body['items'].blank?
      all_groups
    end

    def groups_for_permissions
      all_groups = get_groups

      all_groups.each do |group|
        group['name'] += ' (SYS)' if check_if_system_group?(group, group['group_id'])
      end

      @groups = all_groups.map { |group| [group['name'], group['group_id']] }

      # add options for registered users and guest users
      @groups.unshift(['All Registered Users', 'registered'])
      @groups.unshift(['All Guest Users', 'guest'])
    end

    def construct_request_object(provider)
      collection_applicable = collection_permission_params[:collection_applicable] == 'true'

      granule_applicable = collection_permission_params[:granule_applicable] == 'true'

      req_obj = {
        'group_permissions' => [],
        'catalog_item_identity' => {
          'name'                  => collection_permission_params[:permission_name],
          'provider_id'           => provider,
          'granule_applicable'    => granule_applicable,
          'collection_applicable' => collection_applicable
        }
      }

      collection_access_constraints = collection_permission_params[:collection_access_value].to_h.delete_if { |_key, value| value.blank? }

      collection_temporal_filter = collection_permission_params[:collection_temporal_filter].to_h.delete_if { |_key, value| value.blank? }

      if collection_permission_params.fetch(:collectionsChooser_toList, []).any? || collection_permission_params.fetch(:hidden_collections, []).any? || collection_access_constraints.any? || collection_temporal_filter.any?
        # Create an empty hash for the nested key that we'll populate below
        req_obj['catalog_item_identity']['collection_identifier'] = {}

        # Selected collections as well as hidden collections
        selected_collections = collection_permission_params.fetch(:collectionsChooser_toList, []) + collection_permission_params.fetch(:hidden_collections, [])

        if selected_collections.any?
          req_obj['catalog_item_identity']['collection_identifier'] = {
            'concept_ids' => selected_collections
          }
        end

        if collection_access_constraints.any?
          req_obj['catalog_item_identity']['collection_identifier']['access_value'] = hydrate_constraint_values(collection_access_constraints)
        end

        if collection_temporal_filter.any?
          req_obj['catalog_item_identity']['collection_identifier']['temporal'] = collection_temporal_filter
        end
      end

      if granule_applicable
        granule_access_constraints = collection_permission_params[:granule_access_value].to_h.delete_if { |_key, value| value.blank? }

        granule_temporal_filter = collection_permission_params[:granule_temporal_filter].to_h.delete_if { |_key, value| value.blank? }

        if granule_access_constraints.any? || granule_temporal_filter.any?
          # Create an empty hash for the nested key we'll populate below
          req_obj['catalog_item_identity']['granule_identifier'] = {}

          if granule_access_constraints.any?
            req_obj['catalog_item_identity']['granule_identifier']['access_value'] = hydrate_constraint_values(granule_access_constraints)
          end

          if granule_temporal_filter.any?
            req_obj['catalog_item_identity']['granule_identifier']['temporal'] = granule_temporal_filter
          end
        end
      end

      search_groups = collection_permission_params[:search_groups] || []
      search_and_order_groups = collection_permission_params[:search_and_order_groups] || []

      # Append any groups with search access that the user does not have access to see
      search_groups += collection_permission_params.fetch(:hidden_search_groups, [])

      # Append any groups with search and order access that the user does not have access to see
      search_and_order_groups += collection_permission_params.fetch(:hidden_search_and_order_groups, [])

      search_groups.each do |search_group|
        # we are preventing a user from selecting a group for both search AND search & order
        # if that still happens, we should only keep the group as a search_and_order_group in the ACL
        next if search_and_order_groups.include?(search_group)

        req_obj['group_permissions'] << construct_request_group_permission(search_group, %w(read)) # aka 'search'
      end

      search_and_order_groups.each do |search_and_order_group|
        # PUMP allows for other permissions (Create, Update, Delete) but we don't use them
        # because those permissions are actually controlled by INGEST_MANAGEMENT_ACL
        req_obj['group_permissions'] << construct_request_group_permission(search_and_order_group, %w(read order)) # aka 'search and order'
      end

      req_obj
    end

    # Groups can refer to actual groups or the user type `Guest Users` and `Registered Users`
    # so we need to ensure that we distinguish between the two. When using the pseudo
    # groups mentioned the key for the group permission is `user_type` vs the
    # standard `group_id`
    def construct_request_group_permission(group_id, permissions)
      group_permission = {
        'permissions' => permissions
      }

      if %w(guest registered).include?(group_id)
        group_permission['user_type'] = group_id
      else
        group_permission['group_id'] = group_id
      end

      group_permission
    end
  end
end
