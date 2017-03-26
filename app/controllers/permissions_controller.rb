# :nodoc:
class PermissionsController < ManageCmrController
  include PermissionManagement
  include GroupsHelper

  skip_before_filter :is_logged_in, only: [:get_all_collections]

  add_breadcrumb 'Collection Permissions', :permissions_path

  RESULTS_PER_PAGE = 25

  def index
    # Default the page to 1
    page = params.fetch('page', 1)

    @opts = {
      'provider' => current_user.provider_id,
      'page_num' => page,
      'page_size' => RESULTS_PER_PAGE,
      'identity_type' => 'catalog_item',
      'include_full_acl' => true
    }

    permissions_response = cmr_client.get_permissions(@opts, token)

    @permissions = if permissions_response.success?
                     construct_permissions_summaries(permissions_response.body['items'])
                   else
                     []
                   end

    @permissions = Kaminari.paginate_array(@permissions, total_count: permissions_response.body.fetch('hits', 0)).page(page).per(RESULTS_PER_PAGE)
  end

  def show
    @permission_concept_id = params[:id]
    @search_and_order_groups = []
    @search_groups = []

    permission_response = cmr_client.get_permission(@permission_concept_id, token)

    if permission_response.success?
      permission = permission_response.body

      # sets @permission_name, @collection_options, @granule_options, @collection_entry_ids,
      # @permission_provider, @collection_access_value, and @granule_access_value
      set_catalog_item_identity(permission)

      add_breadcrumb @permission_name, permissions_path(@permission_concept_id)

      # separate search_groups and search_and_order_groups from acl group_permissions
      search_groups_list, search_and_order_groups_list, hidden_search_groups, hidden_search_and_order_groups = parse_group_permission_ids(permission['group_permissions'])

      @permission_type = 'Search' unless search_groups_list.blank? && hidden_search_groups.blank?
      @permission_type = 'Search & Order' unless search_and_order_groups_list.blank? && hidden_search_and_order_groups.blank?

      group_retrieval_error_messages = []

      search_and_order_groups_list.each do |search_and_order_group_id|
        search_and_order_group, error_message = construct_permission_group_for_show(search_and_order_group_id)

        @search_and_order_groups << search_and_order_group if search_and_order_group
        group_retrieval_error_messages << error_message if error_message
      end

      search_groups_list.each do |search_group_id|
        search_group, error_message = construct_permission_group_for_show(search_group_id)

        @search_groups << search_group if search_group
        group_retrieval_error_messages << error_message if error_message
      end

      flash[:error] = group_retrieval_error_messages.join('; ') if group_retrieval_error_messages.length > 0
    else
      Rails.logger.error("Error retrieving a permission: #{permission_response.inspect}")
      error = Array.wrap(permission_response.body['errors'])[0]
      flash[:error] = error
    end
  end

  def new
    @collection_access_value = {}
    @granule_access_value = {}
    @groups = get_groups_for_permissions # check comments in methods. want to try and consolidate what is used for other controllers

    add_breadcrumb 'New', new_permissions_path
  end

  def create
    request_object = construct_request_object(current_user.provider_id)

    response = cmr_client.add_group_permissions(request_object, token)

    if response.success?
      flash[:success] = 'Collection Permission was successfully created.'
      Rails.logger.info("#{current_user.urs_uid} CREATED catalog item ACL (Collection Permission) for #{current_user.provider_id}. #{response.body}")

      concept_id = response.body['concept_id']
      redirect_to permission_path(concept_id)
    else
      Rails.logger.error("Collection Permission Creation Error: #{response.inspect}")

      # Look up the error code. If we have a friendly version, use it. Otherwise,
      # just use the error message as it comes back from the CMR.
      permission_creation_error = PermissionsHelper::ErrorCodeMessages[response.status]
      permission_creation_error ||= Array.wrap(response.body['errors'])[0]

      flash.now[:error] = permission_creation_error

      @permission_name = params[:permission_name]

      @collection_options = params[:collection_options]
      @collection_selections = params[:collection_selections]
      @granule_options = params[:granule_options]

      @groups = get_groups_for_permissions
      @search_groups = params[:search_groups]
      @search_and_order_groups = params[:search_and_order_groups]

      render :new
    end
  end

  def edit
    @permission_concept_id = params[:id]
    permission_response = cmr_client.get_permission(@permission_concept_id, token)

    if permission_response.success?
      permission = permission_response.body

      set_catalog_item_identity(permission)

      add_breadcrumb @permission_name, permissions_path(@permission_concept_id)
      add_breadcrumb 'Edit', edit_permission_path(@permission_concept_id)

      @search_groups, @search_and_order_groups, @hidden_search_groups, @hidden_search_and_order_groups = parse_group_permission_ids(permission['group_permissions'])
      @groups = get_groups_for_permissions
    else
      Rails.logger.error("Error retrieving a permission: #{permission_response.inspect}")
      flash[:error] = Array.wrap(permission_response.body['errors'])[0]
      redirect_to permissions_path
    end
  end

  def update
    @permission_concept_id = params[:id]
    permission_provider = params[:permission_provider]

    request_object = construct_request_object(permission_provider)
    update_response = cmr_client.update_permission(request_object, @permission_concept_id, token)

    if update_response.success?
      flash[:success] = 'Collection Permission was successfully updated.'
      Rails.logger.info("#{current_user.urs_uid} UPDATED catalog item ACL (Collection Permission) for #{permission_provider}. #{response.body}")

      redirect_to permission_path(@permission_concept_id)
    else
      Rails.logger.error("Collection Permission Update Error: #{update_response.inspect}")
      permission_update_error = Array.wrap(update_response.body['errors'])[0]

      if permission_update_error == 'Permission to update ACL is denied'
        flash[:error] = 'You are not authorized to update permissions. Please contact your system administrator.'
        # opt1 send back to show page
        redirect_to permission_path(@permission_concept_id)
      else
        flash[:error] = permission_update_error
        # opt2 parse/grab data, render edit with flash message
        @permission_name = params[:permission_name]

        @collection_options = params[:collection_options]
        @collection_selections = params[:collection_selections]
        @granule_options = params[:granule_options]

        @groups = get_groups_for_permissions
        @search_groups = params[:search_groups]
        @search_and_order_groups = params[:search_and_order_groups]
        @hidden_search_groups = params[:hidden_search_groups].split('; ') if params[:hidden_search_groups]
        @hidden_search_and_order_groups = params[:hidden_search_and_order_groups].split('; ') if params[:hidden_search_and_order_groups]

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
      Rails.logger.error("Permission Deletion Error: #{response.inspect}")
      permission_deletion_error = Array.wrap(response.body['errors'])[0]
      flash[:error] = permission_deletion_error
      render :show
    end
  end

  def get_all_collections
    collections, @errors, hits = get_collections_for_provider(params)

    @option_data = []
    collections.each do |collection|
      opt = [collection['umm']['entry-title'], collection['umm']['entry-id'] + ' | ' + collection['umm']['entry-title']]
      @option_data << opt
    end

    if @errors.length > 0
      render json: { success: false }
    else
      respond_to do |format|
        format.json { render json: { hits: hits, items: @option_data } }
      end
    end
  end

  private

  def get_collections_for_provider(params)
    # page_size default is 10, max is 2000

    query = { 'provider' => current_user.provider_id,
              'page_size' => 25 }

    query['keyword'] = params['entry_id'] + '*' if params.key?('entry_id')

    if params.key?('short_name')
      query['short_name'] = params['short_name'].concat('*')

      # In order to search with the wildcard parameter we need to tell CMR to use it
      query['options'] = {
        'short_name' => {
          'pattern' => true
        }
      }
    end

    query['page_num'] = params['page_num'] if params.key?('page_num')

    collections_response = cmr_client.get_collections(query, token).body
    parse_get_collections_response(collections_response)
  end

  def get_collections_by_entry_titles(entry_titles, provider_id)
    # page_size default is 10, max is 2000
    query = {
      'page_size' => entry_titles.count,
      'entry_title' => entry_titles,
      'provider_id' => provider_id
    }

    collections_response = cmr_client.get_collections_by_post(query, token)
    parse_get_collections_response(collections_response.body)

    # we previously used the GET method for searching collections by entry title,
    # but that may have been too large for Jetty. we are using the POST method
    # until/unless CMR changes collection permissions to utilize concept ids or entry ids
    # collections_response = cmr_client.get_collections(query, token).body
    # parse_get_collections_response(collections_response)
  end

  def parse_get_collections_response(response)
    hits = response['hits'].to_i
    errors = response.fetch('errors', [])
    collections = response.fetch('items', [])

    [collections, errors, hits]
  end

  def get_groups
    # we need to specify page_size, otherwise the default is 10
    # the maximum number of groups we expect from one provider and all system groups
    # is ~40, so 100 should be more than sufficient
    filters = {
      'provider' => current_user.provider_id,
      'page_size' => 100
    }

    # get groups for provider AND System Groups if user has Read permissions on System Groups
    filters['provider'] = [current_user.provider_id, 'CMR'] if policy(:system_group).read?

    groups_response = cmr_client.get_cmr_groups(filters, token)
    groups_for_permissions_select = []

    if groups_response.success?
      tmp_groups = groups_response.body['items']
      tmp_groups.each do |group|
        group['name'] += ' (SYS)' if check_if_system_group?(group, group['concept_id'])
        opt = [group['name'], group['concept_id']]
        groups_for_permissions_select << opt
      end
    else
      Rails.logger.error("Get Cmr Groups Error: #{groups_response.inspect}")
      flash[:error] = Array.wrap(groups_response.body['errors'])[0]
    end

    groups_for_permissions_select
  end

  def get_groups_for_permissions
    groups_for_permissions_select = get_groups

    # add options for registered users and guest users
    groups_for_permissions_select.unshift(['All Registered Users', 'registered'])
    groups_for_permissions_select.unshift(['All Guest Users', 'guest'])

    groups_for_permissions_select
  end

  def construct_request_object(provider)
    if params[:collection_options] == 'all-collections' || params[:collection_options] == 'selected-ids-collections'
      collection_applicable = true
    else # 'no-access'
      collection_applicable = false
    end
    granule_applicable = params[:granule_options] == 'all-granules' ? true : false

    req_obj = {
      'group_permissions' => [],
      'catalog_item_identity' => {
        'name' => params[:permission_name],
        'provider_id' => provider,
        'granule_applicable' => granule_applicable,
        'collection_applicable' => collection_applicable
      }
    }

    # set collection_identifier
    collection_identifier = req_obj.fetch('catalog_item_identity', {}).fetch('collection_identifier', {})
    if params[:collection_options] == 'selected-ids-collections'
      # The split character below is determined by the Chooser widget configuration. We are using this unusual
      # delimiter because collection entry titles could contain commas.
      raw_collection_selections = params[:collection_selections].split('%%__%%')
      entry_titles = []
      raw_collection_selections.each do |collection_selection|
        # collection_selections come from widget as 'entry_id | entry_title',
        # so we need to split them up and pass just entry title values
        parts = collection_selection.split('|')
        entry_titles << parts[1].strip
      end

      collection_identifier['entry_titles'] = entry_titles
    end

    if collection_applicable
      @collection_access_value = params[:collection_access_value] || {}
      @collection_access_value.each do |key, val|
        if val.blank?
          @collection_access_value.delete(key)
        elsif val == 'true'
          @collection_access_value[key] = true
        else
          @collection_access_value[key] = val.to_f
        end
      end
      collection_identifier['access_value'] = @collection_access_value unless @collection_access_value.blank?
      req_obj['catalog_item_identity']['collection_identifier'] = collection_identifier unless collection_identifier.blank?
    end

    if granule_applicable
      @granule_access_value = params[:granule_access_value] || {}
      granule_identifier = req_obj.fetch('catalog_item_identity', {}).fetch('granule_identifier', {})
      @granule_access_value.each do |key, val|
        if val.blank?
          @granule_access_value.delete(key)
        elsif val == 'true'
          @granule_access_value[key] = true
        else
          @granule_access_value[key] = val.to_f
        end
      end
      granule_identifier['access_value'] = @granule_access_value unless @granule_access_value.blank?
      req_obj['catalog_item_identity']['granule_identifier'] = granule_identifier unless granule_identifier.blank?
    end

    search_groups = params[:search_groups] || []
    # if there are hidden groups, add them
    hidden_search_groups = params[:hidden_search_groups].split('; ') if params[:hidden_search_groups]
    search_groups += hidden_search_groups if hidden_search_groups
    search_groups.each do |search_group|
      req_obj['group_permissions'] << construct_request_group_permission(search_group, ['read']) # aka 'search'
    end

    search_and_order_groups = params[:search_and_order_groups] || []
    # if there are hidden groups, add them
    hidden_search_and_order_groups = params[:hidden_search_and_order_groups].split('; ') if params[:hidden_search_and_order_groups]
    search_and_order_groups += hidden_search_and_order_groups if hidden_search_and_order_groups
    search_and_order_groups.each do |search_and_order_group|
      # PUMP allows for other permissions (Create, Update, Delete) but we don't use them
      # because those permissions are actually controlled by INGEST_MANAGEMENT_ACL
      req_obj['group_permissions'] << construct_request_group_permission(search_and_order_group, %w(read order)) # aka 'search'
    end

    req_obj
  end

  def construct_request_group_permission(group_id, permissions)
    group_permission = {}

    if group_id == 'guest' || group_id == 'registered'
      group_permission['user_type'] = group_id
    else
      group_permission['group_id'] = group_id
    end

    group_permission['permissions'] = permissions

    group_permission
  end

  # create summary for Index table (Search or Search & Order)
  def construct_permissions_summaries(permissions)
    permissions.each do |perm|
      is_search_perm = false
      is_search_and_order_perm = false

      group_permissions = perm['acl']['group_permissions']
      group_permissions.each do |group_perm|
        perm_list = group_perm['permissions']
        if perm_list.include?('read') && perm_list.include?('order')
          is_search_and_order_perm = true
        elsif perm_list.include?('read')
          is_search_perm = true
        end
      end

      perm['permission_summary'] = 'Search' if is_search_perm
      perm['permission_summary'] = 'Search & Order' if is_search_and_order_perm
    end

    permissions
  end

  # separate search_groups and search_and_order_groups from acl group_permissions
  def parse_group_permission_ids(group_permissions)
    search_groups = []
    search_and_order_groups = []

    # we need hidden groups if the user is updating a group with system groups
    # and they don't have READ access for system groups
    hidden_search_groups = []
    hidden_search_and_order_groups = []

    group_permissions.each do |group_perm|
      if !(group_perm['group_id'] =~ /(-CMR)$/) || (group_perm['user_type']) || (group_perm['group_id'] =~ /(-CMR)$/ && policy(:system_group).read?)
        # group is not a system group
        # OR group is guest or registered
        # OR group is a system group and user has READ access
        if group_perm['permissions'].include?('read') && group_perm['permissions'].include?('order')
          search_and_order_groups << (group_perm['group_id'] || group_perm['user_type'])
        elsif group_perm['permissions'].include?('read')
          search_groups << (group_perm['group_id'] || group_perm['user_type'])
        end
      elsif
        # group is a system group and user does NOT have READ access
        if group_perm['permissions'].include?('read') && group_perm['permissions'].include?('order')
          hidden_search_and_order_groups << (group_perm['group_id'])
        elsif group_perm['permissions'].include?('read')
          hidden_search_groups << (group_perm['group_id'])
        end
      end
    end

    [search_groups, search_and_order_groups, hidden_search_groups, hidden_search_and_order_groups]
  end

  # set up group hash for show page
  def construct_permission_group_for_show(group_id)
    group = {}

    if group_id == 'guest'
      group[:name] = 'All Guest Users'
    elsif group_id == 'registered'
      group[:name] = 'All Registered Users'
    else
      group_response = cmr_client.get_group(group_id, token)
      if group_response.success?
        group = group_response.body
        group[:name] = group['name']
        group[:concept_id] = group_id
        group[:num_members] = group['num_members']
        retrieval_error_message = nil
      else
        retrieval_error_message = Array.wrap(group_response.body['errors'])[0]
        group = nil
      end
    end

    [group, retrieval_error_message]
  end

  def set_catalog_item_identity(permission)
    show = params[:action] == 'show' ? true : false

    catalog_item_identity = permission.fetch('catalog_item_identity', {})
    @permission_name = catalog_item_identity['name']

    @permission_provider = catalog_item_identity['provider_id']

    if show
      @collection_options = catalog_item_identity['collection_applicable']
      @granule_options = catalog_item_identity['granule_applicable']
    else
      # set options to populate edit form dropdowns
      @collection_options = if catalog_item_identity['collection_applicable'] == true
                              if catalog_item_identity.fetch('collection_identifier', {}).fetch('entry_titles', nil)
                                'selected-ids-collections'
                              else
                                'all-collections'
                              end
                            else # catalog_item_identity['collection_applicable'] == false
                              'no-access'
                            end

      @granule_options = catalog_item_identity['granule_applicable'] ? 'all-granules' : 'no-access'
    end

    collection_identifier = catalog_item_identity.fetch('collection_identifier', {})
    @collection_access_value = collection_identifier.fetch('access_value', {})
    entry_titles = collection_identifier.fetch('entry_titles', nil)
    unless entry_titles.blank?
      collections, _errors, _hits = get_collections_by_entry_titles(entry_titles, @permission_provider)

      if show
        @collection_entry_ids = []
        collections.each do |collection|
          @collection_entry_ids << collection['umm']['entry-id']
        end
      else
        selected_collections = []
        delimiter = '%%__%%'
        collections.each do |collection|
          # widget needs entry_id | entry_title
          opt = collection['umm']['entry-id'] + ' | ' + collection['umm']['entry-title']
          selected_collections << opt
        end
        # the hidden input can only handle text, so the widget is currently using the delimiter to separate the
        # collection display values
        @collection_selections = selected_collections.join(delimiter)
      end
    end

    @granule_access_value = catalog_item_identity.fetch('granule_identifier', {}).fetch('access_value', {})
  end
end
