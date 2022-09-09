describe 'Group show page Manage Provider Object Permissions' do

  before :all do
    VCR.use_cassette('edl', record: :new_episodes) do
      @test_group_name_admin = 'Test_MMT_2_Group_Manage_Provider_Permissions'
      @test_group_description_admin = 'test group'
      @test_group_admin = create_group(
        name: @test_group_name_admin,
        description: @test_group_description_admin,
        provider_id: 'MMT_2'
      )

      @test_group_name_not_admin = 'Test_LARC_Group_Manage_Provider_Permissions'
      @test_group_description_not_admin = 'test group'
      @test_group_not_admin = create_group(
        name: @test_group_name_not_admin,
        description: @test_group_description_not_admin,
        provider_id: 'LARC'
      )
    end
  end

  after :all do
    VCR.use_cassette('edl', record: :new_episodes) do
      delete_group(concept_id: @test_group_admin['group_id'])
      delete_group(concept_id: @test_group_not_admin['group_id'])
    end
  end

  context "when logging in as a provider admin for a group's provider and visiting the group page" do
    before do
      login

      VCR.use_cassette('edl', record: :new_episodes) do
        visit group_path(@test_group_admin['group_id'])
      end
    end

    it 'displays the group show page' do
      expect(page).to have_content(@test_group_name_admin)
      expect(page).to have_content(@test_group_description_admin)
    end

    it 'displays the link to manage Provider Object Permissions' do
      expect(page).to have_content('Manage Provider Object Permissions')
      expect(page).to have_link('Provider Object Permissions for MMT_2', href: edit_provider_identity_permission_path(@test_group_admin['group_id'], redirect_to: page.current_path))
    end
  end

  context "when logging in as provider admin for a group's provider but in a different provider context" do
    before do
      login(provider: 'MMT_1', providers: %w[MMT_1 MMT_2])

      VCR.use_cassette('edl', record: :new_episodes) do
        visit group_path(@test_group_admin['group_id'])
      end
    end

    it 'displays the group show page' do
      expect(page).to have_content(@test_group_name_admin)
      expect(page).to have_content(@test_group_description_admin)
      expect(page).to have_content('Associated Collection Permissions')
      expect(page).to have_content('Members')
    end

    it 'displays the link to manage Provider Object Permissions' do
      expect(page).to have_content('Manage Provider Object Permissions')
      expect(page).to have_link('Provider Object Permissions for MMT_2')
    end

    context 'when clicking on the manage provider object permissions link', js: true do
      before do
        click_on 'Provider Object Permissions for MMT_2'
      end

      it 'displays the modal to change provider context' do
        expect(page).to have_content('Managing Provider Object Permissions for this group requires you change your provider context to MMT_2. Would you like to change your provider context and perform this action?')
      end
    end
  end

  context "when logging in not as a provider admin for a group's provider" do
    context "when logging in with the group's provider context" do
      before do
        login(provider: 'LARC', providers: ['LARC'])

        VCR.use_cassette('edl', record: :new_episodes) do
          visit group_path(@test_group_not_admin['group_id'])
        end
      end

      it 'displays the group show page' do
        expect(page).to have_content(@test_group_name_not_admin)
        expect(page).to have_content(@test_group_description_not_admin)
        expect(page).to have_content('Associated Collection Permissions')
        expect(page).to have_content('Members')
      end

      it 'does not display the link to manage Provider Object Permissions' do
        expect(page).to have_no_content('Manage Provider Object Permissions')
        expect(page).to have_no_link('Provider Object Permissions for LARC')
      end
    end

    context 'when logging in with a different provider context' do
      before do
        login(providers: %w[MMT_2 LARC])

        VCR.use_cassette('edl', record: :new_episodes) do
          visit group_path(@test_group_not_admin['group_id'])
        end
      end

      it 'displays the group show page' do
        expect(page).to have_content(@test_group_name_not_admin)
        expect(page).to have_content(@test_group_description_not_admin)
        expect(page).to have_content('Associated Collection Permissions')
        expect(page).to have_content('Members')
      end

      it 'does not display the link to manage Provider Object Permissions' do
        expect(page).to have_no_content('Manage Provider Object Permissions')
        expect(page).to have_no_link('Provider Object Permissions for LARC')
      end
    end
  end
end
