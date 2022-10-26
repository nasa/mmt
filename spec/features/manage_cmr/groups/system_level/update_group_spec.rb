require "rspec/mocks/standalone"
describe 'Updating System Level Groups', js: true do
  context 'when editing a system level group as an admin' do
    before :all do
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('access_token')
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @group_name = "8b1394ff7be2a459c055"
        @group_description = "Id suscipit enim sint"

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
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('access_token')
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        delete_group(concept_id: @group['group_id'], admin: true)
      end
    end

    before do
      login_admin
      allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('access_token')
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
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

    it 'has the appropriate fields disabled' do
      expect(page).to have_field('Name', readonly: true)
      expect(page).to have_checked_field('System Level Group?', readonly: true)
    end

    context 'when updating the system level group' do
      let(:new_group_description) { 'Id suscipit enim sint' }

      before do
        fill_in 'Description', with: new_group_description

        within '.group-form' do
          allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('access_token')
          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
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
