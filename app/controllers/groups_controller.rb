class GroupsController < ApplicationController
  before_filter :groups_enabled?

  def index
    query = {}
    query['provider'] = @current_user.available_providers
    groups_response = cmr_client.get_cmr_groups(query, token)

    if groups_response.success?
      @groups = groups_response.body['items']
    else
      Rails.logger.error("Get Cmr Groups Error: #{groups_response.inspect}")
      flash[:error] = Array.wrap(group_request.body['errors'])[0]
      @groups = nil
    end
  end

  def show
    concept_id = params[:id]
    group_request = cmr_client.get_group(concept_id, token)
    if group_request.success?
      @group = group_request.body
      request_group_members(concept_id, token)
    else
      flash[:error] = Array.wrap(group_request.body['errors'])[0]
      redirect_to groups_path
    end
  end

  def new
    @group = {}

    @users_options = urs_users
    @selected_users = []
  end

  def create
    group = params[:group]
    members = params[:selected_members] || []

    if valid_group?(group)
      group['provider-id'] = @current_user.provider_id
      group_creation = cmr_client.create_group(group.to_json, token)

      if group_creation.success?
        concept_id = group_creation.body['concept-id']
        flash[:success] = 'Group was successfully created.'

        add_members_to_group(members, concept_id, token)
        redirect_to group_path(concept_id)
      else
        # Log error message
        Rails.logger.error("Group Creation Error: #{group_creation.inspect}")

        group_creation_error = Array.wrap(group_creation.body['errors'])[0]
        flash[:error] = group_creation_error
        @group = group
        set_previously_selected_members(members)
        render :new
      end
    else
      @group = group
      set_previously_selected_members(members)
      render :new
    end
  end

  def edit
    concept_id = params[:id]
    group_request = cmr_client.get_group(concept_id, token)

    if group_request.success?
      @group = group_request.body
    else
      flash[:error] = Array.wrap(group_request.body['errors'])[0]
      redirect_to groups_path
    end
  end

  def update
    concept_id = params[:id]
    group = params[:group]
    if valid_group?(group)
      group['provider-id'] = @current_user.provider_id
      update_response = cmr_client.update_group(concept_id, group.to_json, token)

      if update_response.success?
        concept_id = update_response.body['concept-id']
        redirect_to group_path(concept_id)
      else
        Rails.logger.error("Group Update Error: #{update_response.inspect}")

        flash[:error] = Array.wrap(group_request.body['errors'])[0]
        @group = group
        render :edit
      end
    else
      @group = group
      render :edit
    end
  end

  def destroy
    concept_id = params[:id]
    delete_group_request = cmr_client.delete_group(concept_id, token)
    if delete_group_request.success?
      group_name = params[:name]
      flash[:success] = "Group #{group_name} successfully deleted."
      redirect_to groups_path
    else
      # Log error message
      Rails.logger.error("Group Deletion Error: #{delete_group_request.inspect}")

      delete_group_error = Array.wrap(delete_group_request.body['errors'])[0]
      flash[:error] = delete_group_error
      redirect_to group_path(concept_id)
    end
  end

  private

  def set_previously_selected_members(members)
    all_users = urs_users
    selected = []
    not_selected = []
    all_users.each { |user| members.include?(user[:uid]) ? selected << user : not_selected << user }

    @users_options = not_selected
    @selected_users = selected
  end

  def request_group_members(concept_id, token)
    group_members_request = cmr_client.get_group_members(concept_id, token)
    if group_members_request.success?
      group_members_uids = group_members_request.body
      # match uids in group from cmr to all users
      all_users = urs_users
      group_members = all_users.select { |user| group_members_uids.include?(user[:uid]) }
      @sorted_members = group_members.map { |member| [member[:name], member[:email]] }
                                     .sort_by { |option| option.first.downcase }
    else
      # Log error message
      Rails.logger.error("Get Group Members Error: #{group_members_request.inspect}")

      get_group_members_error = Array.wrap(group_members_request.body['errors'])[0]
      flash[:error] = get_group_members_error
    end
  end

  def add_members_to_group(members, concept_id, token)
    return if members.blank?

    add_members = cmr_client.add_group_members(concept_id, members, token)
    if add_members.success?
      flash[:success] = 'Group was successfully created and members successfully added.'
    else
      # Log error message
      Rails.logger.error("Add Members to Group Error: #{add_members.inspect}")

      add_members_error = Array.wrap(add_members.body['errors'])[0]
      flash[:error] = add_members_error
    end
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
    users_request = cmr_client.get_urs_users
    if users_request.success?
      map_urs_users(users_request.body.sort_by { |_uid, user| user['first_name'].downcase })
    else
      # Log error message
      Rails.logger.error("Users Request Error: #{users_request.inspect}")

      users_request_error = Array.wrap(users_request.body['error'])[0]
      flash[:error] = users_request_error
      []
    end
  end

  def groups_enabled?
    redirect_to dashboard_path unless Rails.configuration.groups_enabled
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
