class DraftsController < ApplicationController
  before_action :set_draft, only: [:show, :edit, :update, :destroy]

  # GET /drafts
  # GET /drafts.json
  def index
    @drafts = Draft.all
  end

  # GET /drafts/1
  # GET /drafts/1.json
  def show
    @draft_json = @draft.draft ? JSON.parse(@draft.draft) : {}

    # Temp call for testing purposes
    overwrite_draft_json_with_dummy_data
  end


  # GET /drafts/new
  def new
    draft = Draft.create(user: @current_user)
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
    if @draft.update_attributes(draft_params)
      case params[:commit]
      when "Save & Done"
        redirect_to @draft, notice: 'Draft was successfully updated.'
      when "Save & Next"
        # Determine next form to go to
        next_form_name = Draft.get_next_form(params["next-section"])
        redirect_to draft_edit_form_path(@draft, next_form_name)
      else # Jump directly to a form
        next_form_name = params["new_form_name"]
        redirect_to draft_edit_form_path(@draft, next_form_name)
      end
    else # record update failed
      render 'edit'
    end
  end

  # DELETE /drafts/1
  # DELETE /drafts/1.json
  # def destroy
  #   @draft.destroy
  #   respond_to do |format|
  #     format.html { redirect_to drafts_url, notice: 'Draft was successfully destroyed.' }
  #     format.json { head :no_content }
  #   end
  # end

  private



  def overwrite_draft_json_with_dummy_data

    @draft_json['EntryId'] = {'Id'=>'test Id', 'Version'=>'test Version', 'Authority'=>'test Authority'}
    @draft_json['Title'] = 'Test Title'
    @draft_json['Abstract'] = 'Test Abstract'
    @draft_json['Purpose'] = 'Test purpose'
    @draft_json['DataLanguage'] = 'Test DataLanguage'
    @draft_json['DataLineage'] = [
        {'Scope'=> 'test Scope', 'Date'=> 'test Date', 'Type'=> 'test type', 'Description'=>'test description', 'Responsibility'=>'test Responsibility'},
        {'Scope'=> 'test 2 Scope', 'Date'=> 'test 2 Date', 'Type'=> 'test 2 type', 'Description'=>'test 2 description', 'Responsibility'=>'test 2 Responsibility'}
    ]
    @draft_json['ResponsibleOrganization'] = [
        {'Role'=> 'test role', 'Party'=> 'test party'},
        {'Role'=> 'test 2 role', 'Party'=> 'test 2 party'}
    ]
    @draft_json['ResponsiblePersonnel'] = [
        {'Role'=> 'test role', 'Party'=> 'test party'},
        {'Role'=> 'test 2 role', 'Party'=> 'test 2 party'}
    ]
    @draft_json['CollectionCitation'] = [
        {'Version'=>'test Version','RelatedUrl'=>'test RelatedUrl','Title'=>'test Title','Creator'=>'test Creator','Editor'=>'test Editor','SeriesName'=>'test SeriesName',
         'ReleaseDate'=>'test ReleaseDate','ReleasePlace'=>'test ReleasePlace','Publisher'=>'test Publisher','IssueIdentification'=>'test IssueIdentification',
         'DataPresentationForm'=>'test DataPresentationForm','OtherCitationDetails'=>'test OtherCitationDetails','DOI'=>'test DOI'},
        {'Version'=>'test 2Version', 'RelatedUrl'=>'test 2 RelatedUrl', 'Title'=>'test 2 Title', 'Creator'=>'test 2 Creator', 'Editor'=>'test 2 Editor',
         'SeriesName'=>'test 2 SeriesName', 'ReleaseDate'=>'test 2 ReleaseDate', 'ReleasePlace'=>'test 2 ReleasePlace', 'Publisher'=>'test 2 Publisher',
         'IssueIdentification'=>'test 2 IssueIdentification', 'DataPresentationForm'=>'test 2 DataPresentationForm', 'OtherCitationDetails'=>'test 2 OtherCitationDetails', 'DOI'=>'test 2 DOI'}
    ]
    @draft_json['Quality'] = 'Test Quality'
    @draft_json['UseConstraints'] = 'Test UseConstraints'
    @draft_json['AccessConstraints'] = {'Description'=>'test description', 'Value'=>'test value'}
    @draft_json['MetadataAssociation'] = [
        {'Type'=> 'test Type', 'Description'=> 'test Description', 'EntryId'=> 'test EntryId', 'ProviderId'=> 'test ProviderId'},
        {'Type'=> 'test 2 Type', 'Description'=> 'test 2 Description', 'EntryId'=> 'test 2 EntryId', 'ProviderId'=> 'test 2 ProviderId'}
    ]
    @draft_json['PublicationReference'] = [
        {'RelatedUrl'=>'test RelatedUrl','Title'=>'test Title','Publisher'=>'test Publisher','DOI'=>'test DOI','Author'=>'test Author','PublicationDate'=>'test PublicationDate',
         'Series'=>'test Series','Edition'=>'test Edition','Volume'=>'test Volume','Issue'=>'test Issue','ReportNumber'=>'test ReportNumber','PublicationPlace'=>'test PublicationPlace',
         'Pages'=>'test Pages','ISBN'=>'test ISBN','OtherReferenceDetails'=>'test OtherReferenceDetails'},
        {'RelatedUrl'=>'test 2 RelatedUrl','Title'=>'test 2 Title','Publisher'=>'test 2 Publisher','DOI'=>'test 2 DOI','Author'=>'test 2 Author','PublicationDate'=>'test 2 PublicationDate',
         'Series'=>'test 2 Series','Edition'=>'test 2 Edition','Volume'=>'test 2 Volume','Issue'=>'test 2 Issue','ReportNumber'=>'test 2 ReportNumber','PublicationPlace'=>'test 2 PublicationPlace',
         'Pages'=>'test 2 Pages','ISBN'=>'test 2 ISBN','OtherReferenceDetails'=>'test 2 OtherReferenceDetails'}
    ]

  end

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
end
