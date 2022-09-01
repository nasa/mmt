describe 'Updating System Level Groups', js: true do
  context 'when editing a system level group as an admin' do
    before :all do
      VCR.use_cassette('edl', record: :new_episodes) do
        @group_name = random_group_name
        @group_description = random_group_description

        @group = create_group(
          name: @group_name,
          description: @group_description,
          provider_id: nil, # System Level groups do not have a provider_id
          admin: true,
          members: %w(rarxd5taqea qhw5mjoxgs2vjptmvzco q6ddmkhivmuhk)
        )
      end
    end

    after :all do
      # System level groups need to be cleaned up to avoid attempting to create
      # a group with the same name in another test (Random names don't seem to be reliable)
      VCR.use_cassette('edl', record: :new_episodes) do
        delete_group(concept_id: @group['group_id'], admin: true)
      end
    end

    before do
      login_admin

      VCR.use_cassette('edl/urs/multiple_users', record: :new_episodes) do
        visit edit_group_path(@group['group_id'])
      end
    end

    it 'displays the page and populated fields on the form' do
      expect(page).to have_content("Edit #{@group_name}")
      # SYS badge
      expect(page).to have_content('SYS')
      expect(page).to have_css('span.eui-badge--sm')

      expect(page).to have_field('Name', with: @group_name)
      expect(page).to have_checked_field('System Level Group?')
      expect(page).to have_field('Description', with: @group_description)
    end

    it 'has the approprate fields disabled' do
      expect(page).to have_field('Name', readonly: true)
      expect(page).to have_checked_field('System Level Group?', readonly: true)
    end

    context 'when updating the system level group' do
      let(:new_group_description) { 'New system group description' }

      before do
        fill_in 'Description', with: new_group_description

        within '.group-form' do
          VCR.use_cassette('edl/urs/multiple_users', record: :new_episodes) do
            click_on 'Submit'
          end
        end

        wait_for_cmr
      end

      it 'displays the original and new group information' do
        expect(page).to have_content('Group was successfully updated.')

        expect(page).to have_content(@group_name)
        expect(page).to have_content(new_group_description)

        # SYS badge
        expect(page).to have_content('SYS')
        expect(page).to have_css('span.eui-badge--sm')

        within '#group-members' do
          expect(page).to have_content('Execktamwrwcqs 02Wvhznnzjtrunff')
          expect(page).to have_content('06dutmtxyfxma Sppfwzsbwz')
          expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
        end
      end
    end
  end
end
