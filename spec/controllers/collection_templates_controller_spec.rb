require 'rails_helper'

describe CollectionTemplatesController, reset_provider: true do
  describe 'GET #index' do
    before do
      sign_in

      get :index, template_type: 'CollectionTemplate'
    end

    it 'renders the #index view' do
      expect(response).to render_template(:index)
    end

    it 'sets the collection_templates instance variable' do
      expect(assigns(:collection_templates)).to eq([])
    end
  end

  describe 'GET #create_draft' do
    context 'creates collection draft' do
      before do
        sign_in
      end

      it 'redirects to collection draft' do
        template = FactoryGirl.create(:full_collection_template)
        get :create_draft, template_type: 'CollectionTemplate', id: template

        expect(response).to redirect_to(collection_draft_path(CollectionDraft.last))
      end

      it 'creates a new collection draft' do
        expect do
          template = FactoryGirl.create(:full_collection_template)
          get :create_draft, template_type: 'CollectionTemplate', id: template
        end.to change(CollectionDraft, :count).by(1)
      end
    end
  end
end
