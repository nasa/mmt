describe ServiceDraftsController, reset_provider: true do
  before do
    set_as_mmt_proper
  end

  describe 'GET #index' do
    before do
      sign_in

      get :index, draft_type: 'ServiceDraft'
    end

    it 'renders the #index view' do
      expect(response).to render_template(:index)
    end

    it 'sets the service_drafts instance variable' do
      expect(assigns(:service_drafts)).to eq([])
    end
  end

  describe 'GET #new' do
    before do
      sign_in

      get :new, draft_type: 'ServiceDraft'
    end

    it 'renders the #new view' do
      expect(response).to render_template(:new)
    end

    it 'sets the service_draft instance variable' do
      expect(assigns(:service_draft)).to be_a_new(ServiceDraft)
    end
  end

  describe 'POST #create' do
    context 'with valid attributes' do
      before do
        sign_in
      end

      it 'redirects to the variable draft edit page' do
        post :create, service_draft: { draft: {} }, draft_type: 'ServiceDraft'

        expect(response).to redirect_to(edit_service_draft_path(ServiceDraft.last))
      end

      it 'creates a new variable draft' do
        expect do
          post :create, service_draft: { draft: {} }, draft_type: 'ServiceDraft'
        end.to change(ServiceDraft, :count).by(1)
      end
    end
  end

  describe 'GET #edit' do
    before do
      sign_in

      draft = FactoryGirl.create(:full_service_draft)

      get :edit, draft_type: 'ServiceDraft', id: draft
    end

    it 'renders the #edit view' do
      expect(response).to render_template(:edit)
    end
  end
end
