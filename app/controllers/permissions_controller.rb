class PermissionsController < ApplicationController

  def index

    # Global provier ID for the current user. At some point we might
    # allow the user to specify a different provider.
    provider_id = @current_user.provider_id
    response = cmr_client.get_permissions_for_provider(provider_id, token)

    unless response.success?
      Rails.logger.error("Error getting permissions: #{response.inspect}")
      error = Array.wrap(response.body['errors'])[0]
      flash[:error] = error
    end

    @permissions = response.body['items']


    # This block searches through the permissions of each
    # group and creates a summary for display on the page
    @permissions.each do |perm|
      permission_summary = {}
      permission_summary_list = []
      group_permissions = perm['acl']['group_permissions']
      group_permissions.each do |group_perm|
        perm_list = group_perm['permissions']
        perm_list.each do |type|
            permission_summary[type] = type
        end
      end

      permission_summary.keys.each do |key|
        if key == 'read'
          key = 'search'
        end
        permission_summary_list << key.capitalize
      end

      perm['permisssion_summary'] = permission_summary_list.join ' & '
    end

  end

  def new
    @collection_ids = []
    @granules_options = []
    @collections_options = []
    @groups = get_groups(params[:filters])
  end

  def show
    # stub
  end

  def create
    #add_group_permissions(provider_id, permission_name, collections, granules, search_groups, search_and_order_groups, token)

    if params[:permissionName].nil? || params[:permissionName].empty?
      msg = 'Permission Name is required.'
      Rails.logger.error("Permission Creation Error: #{msg}")
      flash[:error] = msg
      @groups = get_groups(params[:filters])
      redirect_to new_permission_path
      return
    end

    # Global provier ID for the current user. At some point we may allow the user to specify a different provider.
    provider_id = @current_user.provider_id

    search_groups = params[:searchGroupsVal].split ','
    search_and_order_groups = params[:searchAndOrderGroupsVal].split ','
    collections = params[:collections]
    granules = params[:granules]

    request_object = {
      'group_permissions' => Array.new,
      'catalog_item_identity' => {
        'name' => params[:permissionName],
        'provider_id' => provider_id,
        'granule_applicable' => true
      }
    }

    # TODO -- we will add another condition here to add
    # specifc collection IDs
    collection_applicable = false
    if collections == 'all-collections'
      collection_applicable = true
    end

    request_object['catalog_item_identity']['collection_applicable'] = collection_applicable

    granule_applicable = false
    if granules == 'all-granules'
        granule_applicable = true
    end

    request_object['catalog_item_identity']['granule_applicable'] = granule_applicable

    search_groups.each do |group|
      search_permission = {
        'group_id'=> group,
        'permissions'=> ['read'] # aka "search"
      }
      request_object['group_permissions'] << search_permission
    end

    search_and_order_groups.each do |group|
      search_and_order_permission = {
        'group_id'=> group,
        'permissions'=> ['read', 'order'] # aka "search"
      }
      request_object['group_permissions'] << search_and_order_permission
    end

    response = cmr_client.add_group_permissions(request_object, token)

    if response.success?
      flash[:success] = 'Permission was successfully created.'
      redirect_to permissions_path
    else
      Rails.logger.error("Permission Creation Error: #{response.inspect}")
      permission_creation_error = Array.wrap(response.body['errors'])[0]
      flash[:error] = permission_creation_error
      render :new
    end
  end

  private

  def get_groups(filters)
    if filters && filters['member']
      filters['options'] = { 'member' => { 'and' => true } }
    end

    groups_response = cmr_client.get_cmr_groups(filters, token)
    groups = []

    #TODO!  How do we get all groups for a given provider?

    if groups_response.success?
      tmp_groups = groups_response.body['items']
      tmp_groups.each do |group|
        opt = [group['name'], group['concept_id']]
        groups << opt
      end
    else
      Rails.logger.error("Get Cmr Groups Error: #{groups_response.inspect}")
      flash[:error] = Array.wrap(groups_response.body['errors'])[0]
      groups = nil
    end
    return groups
  end

end
