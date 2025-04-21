describe ManageCmr::GroupsController, reset_provider: true do
  before do
    set_as_mmt_proper
  end

  describe 'GET #index' do
    before do
      sign_in
    end

    it 'renders the #index view' do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        get :index
        expect(response).to render_template(:index)
      end
    end

    it 'requests groups from cmr' do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        expect_any_instance_of(Cmr::UrsClient).to receive('get_edl_groups').and_call_original
        get :index
      end
    end

    context 'When groups are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:groups_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          get :index
          expect(response).to redirect_to(manage_collections_path)
        end
      end
    end
  end

  describe 'GET #show' do
    before do
      @token = 'jwt_access_token'

      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_token')
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        group_response = create_group
        @group_id = group_response['group_id']
      end
    end

    after do
      @token = 'jwt_access_token'
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return(@token)
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        delete_group(concept_id: @group_id)
      end
    end

    before do
      sign_in
    end

    it 'renders the #show view' do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        get :show, params: { id: @group_id }
        expect(response).to render_template(:show)
      end
    end

    it 'requests the group from cmr' do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        expect_any_instance_of(Cmr::UrsClient).to receive('get_edl_group').with(@group_id).and_call_original
        get :show, params: { id: @group_id }
      end
    end

    context 'When groups are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:groups_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        get :show, params: { id: @group_id }

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
