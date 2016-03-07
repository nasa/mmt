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
  end

  def new
    @group = {}
  end

  def create
    group = params[:group]
    if valid_group?(group)
      group['provider-id'] = @current_user.provider_id
      group_creation = cmr_client.create_group(group.to_json, token)

      if group_creation.success?
        concept_id = group_creation.body['concept-id']
        flash[:success] = 'Group was successfully created.'
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
      render :new
    end
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
