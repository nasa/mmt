require 'rails_helper'

describe BulkUpdatesController, reset_provider: true do
  describe 'GET #index' do
    context 'When bulk updates are enabled' do
      before do
        sign_in

        get :index
      end

      it 'renders the #index view' do
        expect(response).to render_template(:index)
      end

      it 'sets the tasks instance variable' do
        expect(assigns(:tasks)).to eq([])
      end
    end

    context 'When bulk updates are disabled' do
      before do
        sign_in

        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage metadata page' do
        get :index

        expect(response).to redirect_to(manage_metadata_path)
      end
    end
  end

  describe 'GET #show' do
    context 'When bulk updates are enabled' do
      before do
        sign_in

        get :show, id: 1
      end

      it 'renders the #show view' do
        expect(response).to render_template(:show)
      end

      it 'sets the task instance variable' do
        expect(assigns(:task)).to eq({})
      end
    end

    context 'When bulk updates are disabled' do
      before do
        sign_in
        
        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage metadata page' do
        get :show, id: 1

        expect(response).to redirect_to(manage_metadata_path)
      end
    end
  end
end
