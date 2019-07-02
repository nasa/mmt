describe ManageCmrController do
  describe 'GET #show' do
    it 'renders the #show view' do
      sign_in

      get :show

      expect(response).to render_template(:show)
    end
  end
end
