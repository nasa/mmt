describe 'Group show page Manage System and Provider Object Permissions',js: true do
  before do
    Rails.cache.clear
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      @admin_group_name = 'Test_Admin_Group_Manage_Provider_and_System_Permissions1'
      @admin_group_description = 'test admin group1'
      @admin_group = create_group(
        name: @admin_group_name,
        description: @admin_group_description,
        provider_id: nil,
        admin: true
      )

      @provider_group_name = 'Test_MMT_2_Group_Manage_Provider_and_System_Permissions1'
      @provider_group_description = 'test group1'
      @provider_group = create_group(
        name: @provider_group_name,
        description: @provider_group_description,
        provider_id: 'MMT_2'
      )
    end
  end

  after :all do
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      delete_group(concept_id: @admin_group['group_id'], admin: true)
      delete_group(concept_id: @provider_group['group_id'])
    end
  end

  context 'when logging in as an System Admin user' do
    before do
      login_admin
    end

    context 'when visiting a system group page', js: true do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          visit group_path(@admin_group['group_id'])
        end
      end

      it 'displays the system group show page' do
        expect(page).to have_content(@admin_group_name)
        expect(page).to have_content(@admin_group_description)

        expect(page).to have_content('SYS')
        expect(page).to have_css('span.eui-badge--sm')

        expect(page).to have_content('Associated Collection Permissions')
        expect(page).to have_content('Members')
      end

      it 'displays the links to manage Provider and System Object Permissions' do
        expect(page).to have_content('Manage Provider and System Object Permissions')
        expect(page).to have_link('System Object Permissions', href: edit_system_identity_permission_path(@admin_group['group_id'], redirect_to: page.current_path))
        expect(page).to have_link('Provider Object Permissions for MMT_2', href: edit_provider_identity_permission_path(@admin_group['group_id'], redirect_to: page.current_path))
      end
    end

    context 'when visiting a provider group page' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          visit group_path(@provider_group['group_id'])
        end
      end

      it 'displays the provider group page' do
        expect(page).to have_content(@provider_group_name)
        expect(page).to have_content(@provider_group_description)
        expect(page).to have_content('Associated Collection Permissions')
        expect(page).to have_content('Members')
      end

      it 'displays the links to manage Provider Object Permissions' do
        expect(page).to have_content('Manage Provider Object Permissions')
        expect(page).to have_link('Provider Object Permissions for MMT_2', href: edit_provider_identity_permission_path(@provider_group['group_id'], redirect_to: page.current_path))
      end

      it 'does not display the link to manage System Object Permissions' do
        expect(page).to have_no_link('System Object Permissions')
      end
    end
  end

  context 'when logging in to a different provider context as a System Admin and visiting the provider group page' do
    before do
      login_admin(provider: 'MMT_1', providers: %w[MMT_1 MMT_2])
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        visit group_path(@provider_group['group_id'])
      end
    end

    it 'displays the provider group page' do
      expect(page).to have_content(@provider_group_name)
      expect(page).to have_content(@provider_group_description)
      expect(page).to have_content('Associated Collection Permissions')
      expect(page).to have_content('Members')
    end

    it 'displays the links to manage Provider Object Permissions' do
      expect(page).to have_content('Manage Provider Object Permissions')
      expect(page).to have_link('Provider Object Permissions for MMT_2')
    end

    it 'does not display the link to manage System Object Permissions' do
      expect(page).to have_no_link('System Object Permissions')
    end

    context 'when clicking on the manage provider object permissions link', js: true do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        before do
          click_on 'Provider Object Permissions for MMT_2'
        end
      end

      it 'displays the modal to change provider context' do
        expect(page).to have_content('Managing Provider Object Permissions for this group requires you change your provider context to MMT_2. Would you like to change your provider context and perform this action?')
      end
    end
  end
end
