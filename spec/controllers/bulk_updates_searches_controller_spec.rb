require 'rails_helper'

describe BulkUpdatesSearchesController, reset_provider: true do
  describe 'GET #new' do
    before :all do
      5.times { publish_draft }
    end

    before do
      sign_in
    end

    context 'When bulk updates are enabled' do
      context 'When no parameters are provided' do
        it 'renders the #new view' do
          get :new

          expect(response).to render_template(:new)
        end

        it 'sets the collections instance variable' do
          get :new

          expect(assigns(:collections)).to eq([])
        end
      end

      context 'When query and field are provided' do
        it 'sets the collections instance variable' do
          get :new, query: 'false', field: 'browsable'

          expect(assigns(:collections).size).to eq(5)
        end
      end
    end

    context 'When bulk updates are disabled' do
      before do
        sign_in
        
        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        get :new

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end
end
