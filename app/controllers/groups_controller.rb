class GroupsController < ApplicationController
  before_filter :groups_enabled?

  def index
  end

  def show
    concept_id = params[:id]
    @group = cmr_client.get_group(concept_id, token).body
    if @group['errors']
      flash[:error] = @group['errors'][0]
      redirect_to groups_path
    end
    # get group users
    group_members_request = cmr_client.get_group_members(concept_id, token)
    if group_members_request.error?
      flash[:alert] = group_members_request.body['errors'][0]
    else
      group_members_uids = group_members_request.body
      # match uids in group from cmr to all users
      all_users = request_all_users
      group_members = all_users.select { |user| group_members_uids.include?(user[:uid]) }
      @sorted_members = group_members.map { |member| [member[:name], member[:email]] }
                                     .sort_by { |option| option.first.downcase }
    end
  end

  def new
    @group = {}

    all_users = request_all_users
    @users_options = map_and_sort_for_select(all_users)
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

        if !members.blank?
          # add members to local cmr
          cmr_client.add_users_to_local_cmr(members, token) if Rails.env.development? || Rails.env.test?

          add_members = cmr_client.add_group_members(concept_id, members.to_json, token)
          if add_members.success?
            flash[:success] = 'Group was successfully created and members successfully added.'
          else
            #TODO need better error handling/error body ?
            flash[:error] = add_members.body['errors'][0]
          end
        end
        redirect_to group_path(concept_id)
      else
        # Log error message
        Rails.logger.error("Group Creation Error: #{group_creation.inspect}")

        group_creation_error = group_creation.body['errors'][0]
        flash[:error] = group_creation_error
        @group = group
        render :new
      end
    else
      @group = group
      all_users = request_all_users
      selected = []
      not_selected = []
      all_users.each { |user| members.include?(user[:uid]) ? selected << user : not_selected << user }

      @users_options = map_and_sort_for_select(not_selected)
      @selected_users = map_and_sort_for_select(selected) # unless selected.empty?
      render :new
    end
  end

  protected
  def map_users(urs_users_hash)
    # get users into hash with name, email, uid
    mapped_users = urs_users_hash.map do |k, v|
                  { name: "#{v['first_name']} #{v['last_name']}",
                    email: v['email_address'],
                    uid: v['uid'] }
                end
    mapped_users
  end

  def request_all_users
    users_request = cmr_client.get_all_users
    if users_request.success?
      users_hash = users_request.body
      all_users = map_users(users_hash)
      all_users
    else
      flash.now[:error] = users_request['errors'][0]
      []
    end
  end

  def map_and_sort_for_select(users)
    # map users into format for options_for_select for dual select box
    users_options = users.map { |user| ["#{user[:name]} | #{user[:email]}", user[:uid]] }
                              .sort_by { |option| option.first.downcase }
    users_options
  end

  private

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
