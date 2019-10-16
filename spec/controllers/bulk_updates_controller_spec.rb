describe BulkUpdatesController, reset_provider: true do
  before do
    set_as_mmt_proper
  end

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

        get :show, params: { id: 1000 }
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
        get :show, params: { id: 1 }

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end

  describe 'POST #new' do
    context 'when bulk updates are enabled' do
      before do
        sign_in

        post :new, params: { search_field: 'short_name', search_query: 'dunno', selected_collections: ['C1200000785-MMT_1'] }
      end

      it 'renders the preview view' do
        expect(response).to render_template(:new)
      end

      it 'sets the task instance variable' do
        expect(assigns(:task)).to be_a(Hash)
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

  describe 'POST #preview' do
    context 'when bulk updates are enabled' do
      before do
        sign_in

        post :preview, params: { concept_ids: ['1', '2'], 'update_field': 'science_keywords' }
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

        post :preview, params: { 'update_field': 'science_keywords' }

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end

  describe 'POST #create' do
    context 'when bulk updates are enabled' do
      context 'when correct data is being sent' do
        before do
          sign_in

          success_response_body = { 'status': 200, 'task-id': '4' }.to_json
          create_bulk_update_response = cmr_success_response(success_response_body)
          allow_any_instance_of(Cmr::CmrClient).to receive(:create_bulk_update).and_return(create_bulk_update_response)

          post :create,
               'concept_ids': ['C1200000785-MMT_1'],
               'name': 'test instruments bulk update',
               'update_field': 'instruments',
               'update_type': 'FIND_AND_UPDATE',
               'find_value': {
                 'ShortName': 'ADS'
               },
               'update_value': {
                 'ShortName': 'ATM',
                 'LongName': 'Airborne Topographic Mapper'
               }
        end

        it 'sets the task instance variable' do
          expect(assigns(:task)).to eq(
            'concept-ids' => ['C1200000785-MMT_1'],
            'name' => 'test instruments bulk update',
            'update-field' => 'INSTRUMENTS',
            'update-type' => 'FIND_AND_UPDATE',
            'find-value' => {
              'ShortName' => 'ADS'
            },
            'update-value' => {
              'ShortName' => 'ATM',
              'LongName' => 'Airborne Topographic Mapper'
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
                 'Category': 'EARTH SCIENCE',
                 'Topic': 'ATMOSPHERE',
                 'Term': 'ATMOSPHERIC TEMPERATURE',
                 'VariableLevel1': 'SURFACE TEMPERATURE'
               }

        end

        it 'renders the new view' do
          expect(response).to render_template(:new)
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
