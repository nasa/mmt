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
    @group = { :name => params.delete(:name),
               :description => params.delete(:description),
               'provider-id' => @current_user.provider_id }
    if @group[:name].empty? || @group[:description].empty?
      flash[:error] = group_validation_error(@group)
      render :new
    else
      group_creation = cmr_client.create_group(@group.to_json, token)

      if group_creation.success?
        concept_id = group_creation.body['concept-id']
        flash[:success] = 'Group was successfully created.'
        redirect_to group_path(concept_id)
      else
        group_creation_error = group_creation.body['errors'][0]
        flash[:error] = group_creation_error
        render :new
      end
    end
  end

  private

  def groups_enabled?
    redirect_to dashboard_path unless Rails.configuration.groups_enabled
  end

  def group_validation_error(group)
    if group[:name].empty? && group[:description].empty?
      error = 'Group Name and Description are required.'
    elsif group[:name].empty?
      error = 'Group Name is required.'
    elsif group[:description].empty?
      error = 'Group Description is required.'
    end
    error
  end
end
