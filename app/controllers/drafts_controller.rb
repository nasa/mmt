class DraftsController < ApplicationController
  before_action :set_draft, only: [:show, :edit, :update, :destroy]
  before_action :load_umm_schema

  # GET /drafts
  # GET /drafts.json
  def index
    @drafts = Draft.all
  end

  # GET /drafts/1
  # GET /drafts/1.json
  def show

    @draft.draft['SpatialExtent'] = {'HorizontalSpatialDomain'=>{'Geometry'=>{'CoordinateSystem'=>'Rectangle',
              'BoundingRectangle'=>{'WestBoundingCoordinate'=>'-180',
                                    'NorthBoundingCoordinate'=>'-62.83',
                                    'EastBoundingCoordinate'=>'180',
                                    'SouthBoundingCoordinate'=>'-90'}
    }}}

    #@draft.draft['SpatialExtent'] = {'HorizontalSpatialDomain'=>{'Geometry'=>{'CoordinateSystem'=>'Point', 'Point'=>{'Longitude'=>'30', 'Latitude'=>'10'}}}}

  end

  # GET /drafts/new
  def new
    draft = Draft.create(user: @current_user, draft: {})
    redirect_to draft_path(draft)
  end

  # GET /drafts/1/edit
  def edit
    if params[:form]
      @draft_form = params[:form]
    else
      render action: 'show'
    end
  end

  # PATCH/PUT /drafts/1
  # PATCH/PUT /drafts/1.json
  def update
    @draft = Draft.find(params[:id])
    if @draft.update_draft(params[:draft])
      case params[:commit]
      when "Save & Done"
        redirect_to @draft, notice: 'Draft was successfully updated.'
      when "Save & Next"
        # Determine next form to go to
        next_form_name = Draft.get_next_form(params["next_section"])
        redirect_to draft_edit_form_path(@draft, next_form_name)
      else # Jump directly to a form
        next_form_name = params["new_form_name"]
        redirect_to draft_edit_form_path(@draft, next_form_name)
      end
    else # record update failed
      # render 'edit' # this should get @draft_form
      # Remove
      redirect_to @draft
    end
  end

  # DELETE /drafts/1
  # DELETE /drafts/1.json
  def destroy
    @draft.destroy
    respond_to do |format|
      format.html { redirect_to dashboard_url} # Retain this for later use?, notice: "Draft \"#{@draft.entry_id}\"was successfully deleted." }
    end
  end

  def open_drafts
    @drafts = @current_user.drafts.order("updated_at DESC")
  end


  private

    # Use callbacks to share common setup or constraints between actions.
    def set_draft
      id = params[:draft_id] || params[:id]
      @draft = Draft.find(id)
      @draft_forms = Draft::DRAFT_FORMS
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def draft_params
      params.require(:draft).permit(:user_id, :draft, :title)
    end

    def load_umm_schema
      @json_schema = JSON.parse(File.read(File.join(Rails.root, 'lib', 'assets', 'schemas', 'umm-c-json-schema.json')))
      # puts @json_schema
    end
end
