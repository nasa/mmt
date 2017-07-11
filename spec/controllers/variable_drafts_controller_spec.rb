require 'rails_helper'

describe VariableDraftsController, reset_provider: true do
  describe 'GET #index' do
    before do
      sign_in

      get :index, draft_type: 'VariableDraft'
    end

    it 'renders the #index view' do
      expect(response).to render_template(:index)
    end

    it 'sets the variable_drafts instance variable' do
      expect(assigns(:variable_drafts)).to eq([])
    end
  end

  # describe 'GET #show' do
  #   before do
  #     sign_in

  #     get :show
  #   end

  #   it 'renders the #show view' do
  #     expect(response).to render_template(:show)
  #   end
  # end

  describe 'GET #new' do
    before do
      sign_in

      get :new, draft_type: 'VariableDraft'
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

        post :create, variable_draft: { draft: {} }, draft_type: 'VariableDraft'
      end

      it 'redirects to the show page' do
      end

      it 'saves the new variable draft to the database' do
      end
    end

    # context 'with invalid attributes' do
    #   before do
    #     sign_in
    
    #     post :create, variable_draft: {}, draft_type: 'VariableDraft'
    #   end
    
    #   it 're-renders the new view' do
    #     expect(response).to render_template(:new)
    #   end
    
    #   it 'does not save the new variable draft to the database' do

    #   end
    # end
  end
end
