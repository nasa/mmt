require 'rails_helper'

describe ManageCollectionsController, reset_provider: true do
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

    it 'sets the bulk updates instance variable' do
      # currently bulk updates are never cleared CMR-3973 may allow us to
      # clear bulk updates and test this as `[]`
      expect(assigns(:bulk_updates)).to be_a(Array)
    end
  end
end
