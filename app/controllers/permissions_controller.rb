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
    @permissions.each do |p|
      permission_summary = {}
      permission_summary_list = []
      group_permissions = p['acl']['group_permissions']
      group_permissions.each do |g|
        perm_list = g['permissions']
        perm_list.each do |i|
            permission_summary[i] = i
        end
      end

      permission_summary.keys.each do |a|
        if a == 'read'
          a = 'search'
        end
        permission_summary_list.push(a.capitalize)
      end

      p['permisssion_summary'] = permission_summary_list.join ' & '
    end

  end

  def new
    @collection_ids = []
    @granules_options = []
    @collections_options = []
    @groups = []

    @filters = params[:filters] || {}
    if @filters['member']
      @filters['options'] = { 'member' => { 'and' => true } }
    end

    groups_response = cmr_client.get_cmr_groups(@filters, token)


    #TODO!  How do we get all groups for a given provider?



    if groups_response.success?

      @tmp_groups = groups_response.body['items']
      for i in @tmp_groups
        opt = [i['name'], i['concept_id'] ]
        @groups.push(opt)
      end


    else
      Rails.logger.error("Get Cmr Groups Error: #{groups_response.inspect}")
      flash[:error] = Array.wrap(groups_response.body['errors'])[0]
      @groups = nil
    end

    @granules_options = [
      ['- Select -', 'select'],
      ['No Access to Granules', 'no-access'],
      ['All Granules', 'all-granules']
      #['All Granules in Selected Collections','all-granules-in-collections'],
      #['Granules with an Access Constraint Value','access-constraint-granule']
    ]

    @collections_options = [
      ['- Select -', 'select'],
      ['All Collections','all-collections']
      #['Selected Collection Entry IDs', 'selected-ids-collections'],
      #['Collections with an Access Constraint Value', 'access-constraint-collections' ]
    ]
  end

  def show
    # stub
  end

  def create
    #add_group_permissions(provider_id, permission_name, collections, granules, search_groups, search_and_order_groups, token)

    # Global provier ID for the current user. At some point we might
    # allow the user to specify a different provider.
    provider_id = @current_user.provider_id

    search_groups = params[:searchGroupsVal].split ','
    search_and_order_groups = params[:searchAndOrderGroupsVal].split ','
    collections = params[:collections]
    granules = params[:granules]

    request_object = {
      'group_permissions' => Array.new,
      'catalog_item_identity' => {
        'name' => params['permissionName'],
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

    search_groups.each do |i|
      search_permission = {
        'group_id'=> i,
        'permissions'=> ['read'] # aka "search"
      }
      request_object['group_permissions'] << search_permission
    end

    search_and_order_groups.each do |i|
      search_and_order_permission = {
        'group_id'=> i,
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
    end
  end
end
