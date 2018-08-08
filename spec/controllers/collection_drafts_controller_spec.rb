require 'rails_helper'

describe CollectionDraftsController, reset_provider: true do
  describe 'POST #create_template' do
    context 'creates a collection template' do
      before do
        sign_in
      end

      it 'redirects to the index page' do
        draft = FactoryGirl.create(:full_collection_draft)

        post :create_template, template: { title: {} }, draft_type: 'CollectionDraft', id: draft
        expect(response).to redirect_to(collection_templates_path)
      end

      it 'creates a new template' do
        expect do
          draft = FactoryGirl.create(:full_collection_draft)

          post :create_template, template: { title: {} }, draft_type: 'CollectionDraft', id: draft
        end.to change(CollectionTemplate, :count).by(1)
      end
    end
  end
end
