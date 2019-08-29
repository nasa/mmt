describe ManageVariablesController do
  before do
    set_as_mmt_proper
  end

  describe 'GET #show' do
    before do
      sign_in

      get :show
    end

    it 'renders the #show view' do
      expect(response).to render_template(:show)
    end

    it 'sets the drafts size limit instance variable' do
      expect(assigns(:draft_display_max_count)).to eq(5)
    end

    it 'sets the drafts instance variable' do
      expect(assigns(:drafts)).to eq([])
    end
  end
end
