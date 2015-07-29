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
    # TODO - review logic to make draft a consistent type
    @draft_json = @draft.draft.is_a?(String) ? JSON.parse(@draft.draft) : (@draft.draft || {})
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

  # POST /drafts
  # POST /drafts.json
  # def create
  #   @draft = Draft.new(draft_params)
  #
  #   respond_to do |format|
  #     if @draft.save
  #       format.html { redirect_to @draft, notice: 'Draft was successfully created.' }
  #       format.json { render :show, status: :created, location: @draft }
  #     else
  #       format.html { render :new }
  #       format.json { render json: @draft.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # PATCH/PUT /drafts/1
  # PATCH/PUT /drafts/1.json
  def update
    # TODO Each "Save" button will call update to update the draft, and navigate to another form or collection page (show action)
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
      @draft_id = id
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
