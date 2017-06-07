require 'rails_helper'

describe ManageMetadataController, reset_provider: true do
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
      # reset_provider does not clear out bulk updates currently
      # providers and bulk updates are stored in different databases in CMR,
      # they have a ticket for cleaning up bulk updates (CMR-3973) but that
      # it is unclear if it will be able to be invoked for reset_provider
      expect(assigns(:bulk_updates)).to be_a(Array)
    end
  end
end
