describe GroupsController, reset_provider: true do
  before do
    set_as_mmt_proper
  end

  describe 'GET #index' do
    before do
      sign_in
    end

    it 'renders the #index view' do
      VCR.use_cassette('edl', record: :new_episodes) do
        get :index
        expect(response).to render_template(:index)
      end
    end

    it 'requests groups from cmr' do
      VCR.use_cassette('edl', record: :new_episodes) do
        expect_any_instance_of(Cmr::UrsClient).to receive('get_edl_groups').and_call_original
        get :index
      end
    end

    context 'When groups are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:groups_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        VCR.use_cassette('edl', record: :new_episodes) do
          get :index
          expect(response).to redirect_to(manage_collections_path)
        end
      end
    end
  end

  describe 'GET #show' do
    before :all do
      VCR.use_cassette('edl', record: :new_episodes) do
        group_response = create_group
        @concept_id = group_response['concept_id']
        puts("concept id is #{@concept_id}")
      end
    end

    before do
      sign_in
    end

    it 'renders the #show view' do
      VCR.use_cassette('edl', record: :new_episodes) do
        get :show, params: { id: @concept_id }
        expect(response).to render_template(:show)
      end
    end

    it 'requests the group from cmr' do
      VCR.use_cassette('edl', record: :new_episodes) do
        expect_any_instance_of(Cmr::UrsClient).to receive('get_edl_group').with(@concept_id).and_call_original
        get :show, params: { id: @concept_id }
      end
    end

    context 'When groups are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:groups_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        get :show, params: { id: @concept_id }

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end

  describe 'GET #new' do
    before do
      sign_in
    end

    context 'When groups are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:groups_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        get :new

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end
end
