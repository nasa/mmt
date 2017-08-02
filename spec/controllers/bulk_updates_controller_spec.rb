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

      it 'sets the bulk_updates instance variable' do
        expect(assigns(:bulk_updates)).to be_a(Array)
      end
    end

    context 'When bulk updates are disabled' do
      before do
        sign_in

        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        get :index

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end

  describe 'GET #show' do
    context 'When bulk updates are enabled' do
      before do
        sign_in

        get :show, id: 1000
      end

      it 'renders the #show view' do
        expect(response).to render_template(:show)
      end

      it 'sets the task instance variable' do
        expect(assigns(:task)).to be_a(Hash)
      end
    end

    context 'When bulk updates are disabled' do
      before do
        sign_in
        
        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        get :show, id: 1

        expect(response).to redirect_to(manage_collections_path)
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

      it 'redirects the user to the manage collections page' do
        sign_in

        get :new

        expect(response).to redirect_to(manage_collections_path)
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

      it 'redirects the user to the manage collections page' do
        sign_in

        post :new

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end

  describe 'GET #preview' do
    context 'when bulk updates are enabled' do
      before do
        sign_in

        get :preview, concept_ids: ['1', '2'], 'update_field': 'science_keywords'
      end

      it 'redirects the user to the bulk updates search page' do
        expect(response).to redirect_to(new_bulk_updates_search_path)
      end
    end

    context 'when bulk updates are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        sign_in

        get :preview

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end

  describe 'POST #preview' do
    context 'when bulk updates are enabled' do
      before do
        sign_in

        post :preview, concept_ids: ['1', '2'], 'update_field': 'science_keywords'
      end

      it 'renders the preview view' do
        expect(response).to render_template(:preview)
      end
    end

    context 'when bulk updates are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        sign_in

        post :preview, 'update_field': 'science_keywords'

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end

  describe 'POST #create' do
    context 'when bulk updates are enabled' do
      context 'when correct data is being sent' do
        before do
          sign_in

          post :create,
               'concept_ids': ['1', '2'],
               'update_field': 'science_keywords',
               'update_type': 'FIND_AND_REPLACE',
               'find_value': {
                 'Category': 'this',
                 'Topic': 'is',
                 'VariableLevel2': 'test'
               },
               'update_value': {
                 'Category': 'EARTH SCIENCE SERVICES',
                 'Topic': 'DATA ANALYSIS AND VISUALIZATION',
                 'Term': 'GEOGRAPHIC INFORMATION SYSTEMS',
                 'VariableLevel1': 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
               }
        end

        it 'sets the task instance variable' do
          expect(assigns(:task)).to eq(
            'concept-ids' => ['1', '2'],
            'update-field' => 'SCIENCE_KEYWORDS',
            'update-type' => 'FIND_AND_REPLACE',
            'find-value' => {
              'Category' => 'this',
              'Topic' => 'is',
              'VariableLevel2' => 'test'
            },
            'update-value' => {
              'Category' => 'EARTH SCIENCE SERVICES',
              'Topic' => 'DATA ANALYSIS AND VISUALIZATION',
              'Term' => 'GEOGRAPHIC INFORMATION SYSTEMS',
              'VariableLevel1' => 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
            }
          )
        end

        it 'redirects to the show page' do
          expect(response.location).to match('\/bulk_updates\/\d+')
          # I was not able to test expect(response).to redirect_to because I
          # was not able to match the id of the bulk update being created
        end
      end

      context 'when incorrect data is being sent' do
        before do
          sign_in

          post :create,
               'concept_ids': [],
               'update_field': 'bad_update_field',
               'update_type': 'BAD_UPDATE_TYPE',
               'update_value': {
                 'Category': 'EARTH SCIENCE SERVICES',
                 'Topic': 'DATA ANALYSIS AND VISUALIZATION',
                 'Term': 'GEOGRAPHIC INFORMATION SYSTEMS',
                 'VariableLevel1': 'DESKTOP GEOGRAPHIC INFORMATION SYSTEMS'
               }

        end

        it 'renders the preview view' do
          expect(response).to render_template(:preview)
        end
      end
    end

    context 'when bulk updates are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:bulk_updates_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        sign_in

        post :create

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end
end
