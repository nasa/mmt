describe ManageCmrController do
  before do
    set_as_mmt_proper
  end

  describe 'GET #show' do
    it 'renders the #show view' do
      sign_in

      get :show

      expect(response).to render_template(:show)
    end
  end
end
