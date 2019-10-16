describe VariableDraftsController, reset_provider: true do
  before do
    set_as_mmt_proper
  end

  describe 'GET #index' do
    before do
      sign_in

      get :index, params: { draft_type: 'VariableDraft' }
    end

    it 'renders the #index view' do
      expect(response).to render_template(:index)
    end

    it 'sets the variable_drafts instance variable' do
      expect(assigns(:variable_drafts)).to eq([])
    end
  end

  describe 'GET #new' do
    before do
      sign_in

      get :new, params: { draft_type: 'VariableDraft' }
    end

    it 'renders the #new view' do
      expect(response).to render_template(:new)
    end

    it 'sets the variable_draft instance variable' do
      expect(assigns(:variable_draft)).to be_a_new(VariableDraft)
    end
  end

  describe 'POST #create' do
    context 'with valid attributes' do
      before do
        sign_in
      end

      it 'redirects to the variable draft edit page' do
        post :create, params: { variable_draft: { draft: {} }, draft_type: 'VariableDraft' }

        expect(response).to redirect_to(edit_variable_draft_path(VariableDraft.last))
      end

      it 'creates a new variable draft' do
        expect do
          post :create, params: { variable_draft: { draft: {} }, draft_type: 'VariableDraft' }
        end.to change(VariableDraft, :count).by(1)
      end
    end
  end

  describe 'GET #edit' do
    before do
      sign_in

      draft = FactoryGirl.create(:full_variable_draft)

      get :edit, params: { draft_type: 'VariableDraft', id: draft }
    end

    it 'renders the #edit view' do
      expect(response).to render_template(:edit)
    end
  end
end
