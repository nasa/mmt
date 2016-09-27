class PermissionsController < ApplicationController

  #-------------------------------------------------------------
  # index - this provides a listing of all the existing
  # permissions.
  #-------------------------------------------------------------
  def index

    # Global provier ID for the current user. At some point we might
    # allow the user to specify a different provider.
    provider_id = @current_user.provider_id
    response = cmr_client.get_permissions_for_provider(provider_id, token)

    if ! response.success?
      Rails.logger.error("Error getting permissions: #{response.inspect}")
      error = Array.wrap(response.body['errors'])[0]
      flash[:error] = error
    end

    @permissions = response.body['items']


    # This block searches through the permissions of each
    # group and creates a summary for display on the page
    @permissions.each do |p|
      permissionSummary = {}
      permissionSummaryList = []
      groupPermissions = p["acl"]["group_permissions"]
      groupPermissions.each do |g|
        permList = g["permissions"]
        permList.each do |i|
            permissionSummary[i] = i
        end
      end

      permissionSummary.keys.each do |a|
        if a == "read"
          a = "search"
        end
        permissionSummaryList.push(a.capitalize)
      end

      p["permisssion_summary"] = permissionSummaryList.join " & "
    end

  end


  #-------------------------------------------------------------
  # new - method for handling adding of a new permission
  #-------------------------------------------------------------
  def new

    #@collectionsOptions = []
    @collectionIDs = []
    @granulesOptions = []
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
        opt = [i["name"], i["concept_id"] ]
        @groups.push(opt)
      end


    else
      Rails.logger.error("Get Cmr Groups Error: #{groups_response.inspect}")
      flash[:error] = Array.wrap(groups_response.body['errors'])[0]
      @groups = nil
    end

    @granulesOptions = [
      ['- Select -', 'select'],
      ['No Access to Granules', 'no-access'],
      ['All Granules', 'all-granules']
      #['All Granules in Selected Collections','all-granules-in-collections'],
      #['Granules with an Access Constraint Value','access-constraint-granule']
    ]

    @collectionsOptions = [
      ['- Select -', 'select'],
      ['All Collections','all-collections']
      #['Selected Collection Entry IDs', 'selected-ids-collections'],
      #['Collections with an Access Constraint Value', 'access-constraint-collections' ]
    ]

  end


  #-------------------------------------------------------------
  # show - shows a specific permission detail
  #-------------------------------------------------------------
  def show

  end


  #-------------------------------------------------------------
  # create - woker method to create a new permission
  #-------------------------------------------------------------
  def create

    #add_group_permissions(provider_id, permission_name, collections, granules, search_groups, search_and_order_groups, token)

    # Global provier ID for the current user. At some point we might
    # allow the user to specify a different provider.
    provider_id = @current_user.provider_id

    searchGroups = params["searchGroupsVal"].split ','
    searchAndOrderGroups = params["searchAndOrderGroupsVal"].split ','


    response = cmr_client.add_group_permissions(provider_id,
      params["permissionName"],
      params["collections"],
      params["granules"],
      searchGroups,
      searchAndOrderGroups,
      token
    )

    if response.success?
      flash[:success] = 'Permission was successfully created.'
      redirect_to permissions_path
    else
      Rails.logger.error("Permission Creation Error: #{response.inspect}")
      permission_creation_error = Array.wrap(response.body['errors'])[0]
      flash[:error] = permission_creation_error
      #render :index
    end

  end



end # end class
