class GroupsController < ApplicationController
  def index
  end

  def show
    concept_id = params[:id]
    @group = cmr_client.get_group(concept_id, token).body
    if @group['errors']
      flash[:error] = @group['errors'][0]
      # redirect_to error group page?
      redirect_to groups_path
    end
  end

  def new
    @group = {}
  end

  def create
    # name, description required
    @group = params.clone
    if params[:name].empty? && params[:description].empty?
      flash[:error] = 'Group Name and Description are required.'
      render :new
    elsif params[:name].empty?
      flash[:error] = 'Group Name is required.'
      render :new
    elsif params[:description].empty?
      flash[:error] = 'Group Description is required.'
      render :new
    else
      @group = {}
      @group['name'] = params[:name]
      @group['provider-id'] = @current_user.provider_id
      @group['description'] = params[:description]

      group_creation = cmr_client.create_group(@group.to_json, token)

      if group_creation.success?
        concept_id = group_creation.body['concept-id']
        flash[:success] = 'Group was successfully created.'
        redirect_to group_path(concept_id)
      else
        # {"errors":["object instance has properties which are not allowed by the schema: [\"provider_id\"]"]}
        group_creation_error = group_creation.body['errors'][0]
        # Rails.logger.error("")
        flash[:error] = group_creation_error
        render :new
      end
    end
  end
end
