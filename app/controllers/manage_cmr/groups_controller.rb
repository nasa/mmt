# :nodoc:
class GroupsController < ManageCmrController
  include GroupsHelper
  include UrsUserEndpoints
  include PermissionManagement

  skip_before_action :ensure_user_is_logged_in, :setup_query, :refresh_urs_if_needed, only: [:urs_search]

  add_breadcrumb 'Groups', :groups_path

  RESULTS_PER_PAGE = 25

  def index
    # these params are not used for mass assignment, only for searching cmr
    # additionally, it was too time consuming to implement strong params due to
    # nested and array values not responding to `permit` as expected
    permitted = params.to_unsafe_h unless params.nil?

    @filters = permitted[:filters] || {}
    @query = {}

    # set provider defaults
    @filters['provider_segment'] ||= 'current'
    @groups_provider_ids = current_user.available_providers.dup

    # CMR is not an actual provider, but is the provider given to system groups
    # as a user cannot have CMR in their available_providers we have to determine when to add it to the filter drop down
    if @filters['provider'].present?
      @query['provider'] = @filters['provider']
      # if provider is CMR, it should be an option in the select
      @groups_provider_ids << 'CMR' if @filters['provider'].include?('CMR')
    elsif @filters['provider_segment'] == 'current'
      @query['provider'] = [current_user.provider_id]
    elsif @filters['provider_segment'] == 'available'
      @query['provider'] = @groups_provider_ids unless policy(:system_group).read? && @filters['show_system_groups'] == 'true'
    end

    @member_filter_details = if @filters['member']
                               @query['member'] = @filters['member']
                               @query['options'] = { 'member' => { 'and' => true } }

                               retrieve_urs_users(@query['member']).map { |m| [urs_user_full_name(m), m['uid']] }
                             else
                               []
                             end

    # set page defaults
    @query[:page_size] = RESULTS_PER_PAGE
    page = params.permit(:page).fetch('page', 1)
    @query[:page_num] = page.to_i

    groups_response = cmr_client.get_cmr_groups(@query, token)

    group_list = if groups_response.success?
                   groups_response.body.fetch('items', [])
                 else
                   []
                 end

    @groups = Kaminari.paginate_array(group_list, total_count: groups_response.body.fetch('hits', 0)).page(page).per(RESULTS_PER_PAGE)
  end

  def show
    @concept_id = params[:id]
    group_response = cmr_client.get_group(@concept_id, token)

    if group_response.success?
      @group = group_response.body

      request_group_members(@concept_id)

      set_collection_permissions
      check_if_current_group_provider_acl_administrator(group_provider: @group['provider_id']) unless current_provider?(@group['provider_id'])

      add_breadcrumb @group.fetch('name'), group_path(@concept_id)
    else
      Rails.logger.error("Get Group Error: #{group_response.clean_inspect}")
      redirect_to groups_path, flash: { error: group_response.error_message(i18n: I18n.t('controllers.groups.show.flash.error')) }
    end
  end

  def new
    @group = {}

    @members = []

    @is_system_group = false # initially set checkbox to unchecked

    add_breadcrumb 'New', new_group_path
  end

  def create
    @group = group_params
    @is_system_group = params[:system_group]
    @group['provider_id'] = current_user.provider_id unless @is_system_group

    group_creation_response = cmr_client.create_group(@group, token)

    if group_creation_response.success?
      redirect_to group_path(group_creation_response.body.fetch('concept_id', nil)), flash: { success: 'Group was successfully created.' }
    else
      # Log error message
      Rails.logger.error("Create Group Error: #{group_creation_response.clean_inspect}")
      flash[:error] = group_creation_response.error_message(i18n: I18n.t('controllers.groups.create.flash.error'))

      set_previously_selected_members(group_params.fetch('members', []))

      render :new
    end
  end

  def edit
    @concept_id = params[:id]
    @members = []
    @non_authorized_members = []

    group_response = cmr_client.get_group(@concept_id, token)

    if group_response.success?
      @group = group_response.body

      add_breadcrumb @group.fetch('name'), group_path(@concept_id)
      add_breadcrumb 'Edit', edit_group_path(@concept_id)

      @is_system_group = check_if_system_group?(@group, @concept_id)

      group_members_response = cmr_client.get_group_members(@concept_id, token)
      if group_members_response.success?
        group_member_uids = group_members_response.body

        set_previously_selected_members(group_member_uids)
      else
        Rails.logger.error("Group Members Request Error: #{group_members_response.clean_inspect}")
        flash[:error] = group_members_response.error_message(i18n: I18n.t('controllers.groups.edit.flash.retrieve_members_error'))
      end
    else
      Rails.logger.error("Retrieve Group to Edit Error: #{group_response.clean_inspect}")
      redirect_to groups_path, flash: { error: group_response.error_message(i18n: I18n.t('controllers.groups.edit.flash.retrieve_group_error')) }
    end
  end

  def update
    params[:group][:members] ||= []
    @group = group_params

    # Append non authorized users if any were provided
    (@group['members'] << params[:non_authorized_members]).flatten! unless params[:non_authorized_members].blank?

    @is_system_group = params[:system_group] || false

    @group['provider_id'] = current_user.provider_id unless @is_system_group

    update_response = cmr_client.update_group(params[:id], @group, token)

    if update_response.success?
      redirect_to group_path(update_response.body.fetch('concept_id', nil)), flash: { success: 'Group was successfully updated.' }
    else
      Rails.logger.error("Update Group Error: #{update_response.clean_inspect}")
      flash[:error] = update_response.error_message(i18n: I18n.t('controllers.groups.update.flash.error'))

      set_previously_selected_members(@group.fetch('members', []))

      render :edit
    end
  end

  def destroy
    concept_id = params[:id]
    delete_group_response = cmr_client.delete_group(concept_id, token)
    if delete_group_response.success?
      redirect_to groups_path, flash: { success: "Group #{params[:name]} successfully deleted." }
    else
      # Log error message
      Rails.logger.error("Delete Group Error: #{delete_group_response.clean_inspect}")
      redirect_to group_path(concept_id), flash: { error: delete_group_response.error_message(i18n: I18n.t('controllers.groups.destroy.flash.error')) }
    end
  end

  def invite
    @valid_email = cmr_client.urs_email_exist? params['invite']['email']
    unless @valid_email
      user = params['invite']
      manager = {}
      manager['name'] = session[:name]
      manager['email'] = session[:email_address]
      manager['provider'] = current_user.provider_id

      invite = UserInvite.new_invite(user, manager)
      invite.send_invite
    end
    respond_to do |format|
      format.js
    end
  end

  def accept_invite
    @invite = UserInvite.where(token: params[:token]).first

    urs_search_response = cmr_client.search_urs_users(@invite.user_email)

    recipient_uid = if urs_search_response.success?
                      urs_search_response.body.fetch('users', [])
                      .find { |user| user['email_address'] == @invite.user_email }['uid']
                    end

    @added = recipient_uid && @invite.accept_invite(cmr_client, recipient_uid, token)
  end

  private

  def group_params
    params.require(:group).permit(:name, :description, :provider_id, members: [])
  end

  def set_members(group_member_uids)
    @members = if group_member_uids.any?
                 retrieve_urs_users(group_member_uids).sort_by { |member| member['first_name'] }
               else
                 []
               end

    @non_authorized_members = group_member_uids.reject { |uid| @members.map { |m| m['uid'] }.include?(uid) }.reject(&:blank?).map { |uid| { 'uid' => uid } }
  end

  def set_previously_selected_members(group_member_uids)
    set_members(group_member_uids)

    @members.map! { |m| [urs_user_full_name(m), m['uid']] }
  end

  def request_group_members(concept_id)
    @members = []

    group_members_response = cmr_client.get_group_members(concept_id, token)

    if group_members_response.success?
      group_member_uids = group_members_response.body

      set_members(group_member_uids)

      (@members << @non_authorized_members).flatten!
    else
      Rails.logger.error("Get Group Members Error: #{group_members_response.clean_inspect}")
    end
  end

  # Get all of the permissions for the current group
  def set_collection_permissions
    # Initialize the permissions array to provide to the view
    @permissions = []
    all_permissions = []

    # Default the params that we'll send to CMR
    permission_params = {
      'permitted_group' => @concept_id,
      'identity_type' => 'catalog_item',
      'include_full_acl' => true,
      page_num: 1,
      page_size: 50
    }

    # Retrieve the first page of permissions
    response = cmr_client.get_permissions(permission_params, token)

    # Request permissions
    until response.error? || response.body.fetch('items', []).empty?
      # Add the retrieved permissions to our array
      all_permissions.concat(response.body['items'])

      # Increment the page number
      permission_params[:page_num] += 1

      # Request the next page
      response = cmr_client.get_permissions(permission_params, token)
    end

    all_permissions.each do |permission|
      group_permissions = permission.fetch('acl', {}).fetch('group_permissions', [{}])

      # collection permissions should show as associated permission on the group page
      # only if the group has Search or Search & Order permissions (if a group has only Order permissions, that implies having Search)
      if group_permissions.any? { |group_permission| group_permission['group_id'] == @concept_id && (group_permission['permissions'].include?('read') || group_permission['permissions'].include?('order')) }
        @permissions << permission
      end
    end

    @permissions.sort_by! { |permission| permission['name'] }
  end

  def edl_groups_enabled?
    Rails.configuration.edl_groups_enabled
  end
end
