require 'rails_helper'

describe VariableDraftsController, reset_provider: true do
  describe 'GET #index' do
    before do
      sign_in

      get :index
    end

    it 'renders the #index view' do
      expect(response).to render_template(:index)
    end

    it 'sets the variable_drafts instance variable' do
      expect(assigns(:variable_drafts)).to eq([])
    end
  end

  describe 'GET #show' do
    before do
      sign_in

      get :show
    end

    it 'renders the #show view' do
      expect(response).to render_template(:show)
    end
  end

  describe 'GET #new' do
    before do
      sign_in

      get :new
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

        post :create, # need params
             draft_type: 'CollectionDraft'
      end

      it 'redirects to the show page'

      it 'saves the new variable draft to the database' do

      end
    end

    # context 'with invalid attributes' do
    #   before do
    #     sign_in
    #
    #     post :create # what are bad params?
    #   end
    #
    #   it 're-renders the new view'
    #
    #   it 'does not save the new variable draft to the database'
    # end
  end
end
