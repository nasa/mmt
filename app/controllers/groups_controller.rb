class GroupsController < ManageCmrController
  include GroupsHelper

  before_filter :groups_enabled?
  before_filter :check_if_system_group_administrator, except: [:index, :show, :destroy]

  add_breadcrumb 'Groups', :groups_path

  RESULTS_PER_PAGE = 25

  def index
    @filters = params[:filters] || {}
    if @filters['member']
      @filters['options'] = { 'member' => { 'and' => true } }
    end

    @filters[:page_size] = RESULTS_PER_PAGE

    # Default the page to 1
    page = params.fetch('page', 1)

    @filters[:page_num] = page.to_i

    groups_response = cmr_client.get_cmr_groups(@filters, token)

    @users = urs_users

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

      add_breadcrumb @group.fetch('name'), group_path(@concept_id)

      request_group_members(@concept_id)
    else
      Rails.logger.error("Get Group Error: #{group_response.inspect}")
      flash[:error] = Array.wrap(group_response.body['errors'])[0]
      redirect_to groups_path
    end
  end

  def new
    @group = {}

    @users_options = urs_users
    @selected_users = []

    @is_system_group = false # initially set checkbox to unchecked

    add_breadcrumb 'New', new_group_path
  end

  def create
    @group = group_params

    # members = params[:selected_members] || []
    @is_system_group = params[:system_group]

    if valid_group?(@group)
      @group['provider_id'] = current_user.provider_id unless @is_system_group
      # from CMR docs on group fields: members - Optional. May be specified in create and update operations
      # @group['members'] = members unless members.blank?

      group_creation_response = cmr_client.create_group(@group, token)

      if group_creation_response.success?
        concept_id = group_creation_response.body['concept_id']
        flash[:success] = 'Group was successfully created.'

        redirect_to group_path(concept_id)
      else
        # Log error message
        Rails.logger.error("Group Creation Error: #{group_creation_response.inspect}")

        group_creation_error = Array.wrap(group_creation_response.body['errors'])[0]
        flash[:error] = group_creation_error
        set_previously_selected_members(group_params.fetch('members', []))
        render :new
      end
    else
      set_previously_selected_members(group_params.fetch('members', []))
      render :new
    end
  end

  def edit
    @concept_id = params[:id]
    group_response = cmr_client.get_group(@concept_id, token)
    all_users = urs_users

    if group_response.success?
      @group = group_response.body

      add_breadcrumb @group.fetch('name'), group_path(@concept_id)
      add_breadcrumb 'Edit', edit_group_path(@concept_id)

      @is_system_group = check_if_system_group?(@group, @concept_id)

      group_members_response = cmr_client.get_group_members(@concept_id, token)
      if group_members_response.success?
        group_member_uids = group_members_response.body

        @selected_users = all_users.select { |user| group_member_uids.include?(user[:uid]) }
        @users_options = all_users - @selected_users
        # @selected_users = []
      else
        Rails.logger.error("Group Members Request: #{group_members_response.inspect}")

        error = Array.wrap(group_members_response.body['errors'])[0]
        flash[:error] = error
      end
    else
      Rails.logger.error("Error retrieving group to edit: #{group_response.inspect}")
      flash[:error] = Array.wrap(group_response.body['errors'])[0]
      redirect_to groups_path
    end
  end

  def update

    @group = group_params
    @is_system_group = params.fetch(:system_group, false)

    @group['provider_id'] = current_user.provider_id unless @is_system_group
    update_response = cmr_client.update_group(params[:id], @group, token)

    if update_response.success?
      redirect_to group_path(update_response.body.fetch('concept_id', nil)), flash: { success: 'Group was successfully updated.' }
    else
      Rails.logger.error("Group Update Error: #{update_response.inspect}")

      flash[:error] = Array.wrap(update_response.body['errors'])[0]

      set_previously_selected_members(@group.fetch('members', []))

      render :edit
    end
  end

  def destroy
    concept_id = params[:id]
    delete_group_response = cmr_client.delete_group(concept_id, token)
    if delete_group_response.success?
      group_name = params[:name]
      flash[:success] = "Group #{group_name} successfully deleted."
      redirect_to groups_path
    else
      # Log error message
      Rails.logger.error("Group Deletion Error: #{delete_group_response.inspect}")

      delete_group_error = Array.wrap(delete_group_response.body['errors'])[0]
      flash[:error] = delete_group_error
      redirect_to group_path(concept_id)
    end
  end

  def invite
    user = params['invite']
    manager = {}
    manager['name'] = session[:name]
    manager['email'] = session[:email_address]
    manager['provider'] = current_user.provider_id

    invite = UserInvite.new_invite(user, manager)
    invite.send_invite

    respond_to do |format|
      format.js
    end
  end

  def accept_invite
    @invite = UserInvite.where(token: params[:token]).first
    @added = @invite.accept_invite(cmr_client, current_user.urs_uid, token)
  end

  private

  def group_params
    params.require(:group).permit(:name, :description, :provider_id, members: [])
  end

  def set_previously_selected_members(members)
    all_users = urs_users
    selected = []
    not_selected = []
    all_users.each { |user| members.include?(user[:uid]) ? selected << user : not_selected << user }

    @users_options = not_selected
    @selected_users = selected
  end

  def request_group_members(concept_id)
    @selected_users = []

    group_members_response = cmr_client.get_group_members(concept_id, token)
    if group_members_response.success?
      group_members_uids = group_members_response.body

      # match uids in group from cmr to all users
      @selected_users = urs_users.select { |user| group_members_uids.include?(user[:uid]) }

      @selected_users.sort_by { |user| user[:name].downcase }
    else
      # Log error message
      Rails.logger.error("Get Group Members Error: #{group_members_response.inspect}")

      get_group_members_error = Array.wrap(group_members_response.body['errors'])[0]
      flash[:error] = get_group_members_error
    end

    @selected_users
  end

  def map_urs_users(urs_users)
    # get users into hash with name, email, uid
    urs_users.map do |_uid, user|
      {
        name: "#{user['first_name']} #{user['last_name']}",
        email: user['email_address'],
        uid: user['uid']
      }
    end
  end

  def urs_users
    urs_users = []

    users_response = cmr_client.get_urs_users
    if users_response.success?
      urs_users = map_urs_users(users_response.body.sort_by { |_uid, user| user['first_name'].downcase })
    else
      # Log error message
      Rails.logger.error("Users Request Error: #{users_response.inspect}")

      # error should be json, but URS has given an html response for a 500 error
      if users_response.body['error']
        users_response_error = Array.wrap(users_response.body['error'])[0]
      else
        # error is related to getting users from URS
        users_response_error = 'An unexpected URS error has occurred.'
      end
      flash[:error] = users_response_error
    end

    urs_users
  end

  def groups_enabled?
    redirect_to manage_metadata_path unless Rails.configuration.groups_enabled
  end

  def valid_group?(group)
    case
    when group[:name].empty? && group[:description].empty?
      flash[:error] = 'Group Name and Description are required.'
    when group[:name].empty?
      flash[:error] = 'Group Name is required.'
    when group[:description].empty?
      flash[:error] = 'Group Description is required.'
    else
      return true
    end
    false
  end
end
