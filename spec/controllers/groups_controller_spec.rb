require 'rails_helper'

describe GroupsController, reset_provider: true do
  describe 'GET #index' do
    before do
      sign_in
    end

    it 'renders the #index view' do
      get :index

      expect(response).to render_template(:index)
    end

    it 'requests groups from cmr' do
      expect_any_instance_of(Cmr::CmrClient).to receive('get_cmr_groups').and_call_original

      get :index
    end

    context 'When groups are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:groups_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        get :index

        expect(response).to redirect_to(manage_collections_path)
      end
    end
  end

  describe 'GET #show' do
    before :all do
      group_response = create_group

      @concept_id = group_response['concept_id']
    end

    before do
      sign_in
    end

    it 'renders the #show view' do
      get :show, id: @concept_id

      expect(response).to render_template(:show)
    end

    it 'requests the group from cmr' do
      expect_any_instance_of(Cmr::CmrClient).to receive('get_group').with(@concept_id, anything).and_call_original

      get :show, id: @concept_id
    end

    context 'When groups are disabled' do
      before do
        allow(Mmt::Application.config).to receive(:groups_enabled).and_return(false)
      end

      it 'redirects the user to the manage collections page' do
        get :show, id: @concept_id

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
