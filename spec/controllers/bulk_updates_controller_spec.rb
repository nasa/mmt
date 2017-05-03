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

  describe 'GET #new' do
    context 'when bulk updates are enabled' do
      before do
        sign_in

        get :new, search_field: 'short_name', search_query: 'dunno'
      end

      it 'redirects the user to the bulk updates search page' do
        expect(response).to redirect_to(new_bulk_updates_search_path)
      end
    end

    context 'when bulk updates are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage metadata page' do
        sign_in

        get :new

        expect(response).to redirect_to(manage_metadata_path)
      end
    end
  end

  describe 'POST #new' do
    context 'when bulk updates are enabled' do
      before do
        sign_in

        post :new, search_field: 'short_name', search_query: 'dunno'
      end

      it 'renders the preview view' do
        expect(response).to render_template(:new)
      end
    end

    context 'when bulk updates are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage metadata page' do
        sign_in

        post :new

        expect(response).to redirect_to(manage_metadata_path)
      end
    end
  end

  describe 'GET #preview' do
    context 'when bulk updates are enabled' do
      before do
        sign_in

        get :preview, concept_ids: ['1', '2']
      end

      it 'redirects the user to the bulk updates search page' do
        expect(response).to redirect_to(new_bulk_updates_search_path)
      end
    end

    context 'when bulk updates are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage metadata page' do
        sign_in

        get :preview

        expect(response).to redirect_to(manage_metadata_path)
      end
    end
  end

  describe 'POST #preview' do
    context 'when bulk updates are enabled' do
      before do
        sign_in

        post :preview, concept_ids: ['1', '2']#, search_field: 'short_name', search_query: 'dunno'
      end

      it 'renders the preview view' do
        expect(response).to render_template(:preview)
      end
    end

    context 'when bulk updates are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage metadata page' do
        sign_in

        post :preview

        expect(response).to redirect_to(manage_metadata_path)
      end
    end
  end
end
