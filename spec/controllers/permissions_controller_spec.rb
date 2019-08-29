describe PermissionsController, reset_provider: true do
  before do
    set_as_mmt_proper
  end

  describe 'GET #index' do
    before do
      sign_in
    end

    it 'renders the #index view' do
      get :index

      expect(response).to render_template(:index)
    end

    # it 'sets the permissions instance variable' do
    #   get :index

    #   expect(assigns(:permissions)).to be_a(Array)
    # end

    it 'requests groups from cmr' do
      expect_any_instance_of(Cmr::CmrClient).to receive('get_permissions').and_call_original

      get :index
    end
  end

  describe 'GET #show' do
    before :all do
      @group_name = 'Permissions Controller Test Group'
      @group = create_group(name: @group_name, members: ['testuser'])

      @permission_name = 'Permissions Permission Name'

      permission = {
        group_permissions: [{
          group_id: @group['concept_id'],
          permissions: %w(read order)
        }, {
          user_type: 'registered',
          permissions: %w(read order)
        }, {
          user_type: 'guest',
          permissions: %w(read)
        }],
        catalog_item_identity: {
          name: @permission_name,
          provider_id: 'MMT_2',
          granule_applicable: true,
          collection_applicable: true
        }
      }

      @permission = add_group_permissions(permission)
    end

    before do
      sign_in
    end

    it 'renders the #show view' do
      get :show, id: @permission['concept_id']

      expect(response).to render_template(:show)
    end

    it 'sets the permission instance variable' do
      get :show, id: @permission['concept_id']

      expect(assigns(:permission).keys).to eq(%w(group_permissions catalog_item_identity))
    end

    it 'requests groups from cmr' do
      expect_any_instance_of(Cmr::CmrClient).to receive('get_permission').and_call_original

      get :show, id: @permission['concept_id']
    end
  end

  describe 'GET #new' do
    before do
      sign_in

      get :new
    end

    it 'renders the #new view' do
      expect(response).to render_template(:new)
    end

    it 'sets the permission instance variable' do
      expect(assigns(:permission)).to eq({})
    end
  end
end
