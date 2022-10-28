describe 'Creating System Level Groups', reset_provider: true do
  context 'when viewing new groups form as an admin user' do
    before do
      login_admin

      visit new_group_path
    end

    it 'shows the system group checkbox' do
      expect(page).to have_content('System Level Group?')
      expect(page).to have_unchecked_field('system_group')
    end

    context 'when clicking the system group checkbox', js: true do
      before do
        check 'System Level Group?'
      end

      it 'changes the New Group header title' do
        expect(page).to have_content('New CMR Group')
        expect(page).to have_content('SYS')
        expect(page).to have_css('span.eui-badge--sm')
      end
    end

    context 'when creating the system level group', js: true do
      # Because this is a system level group, it never gets cleaned up, we need to ensure
      # that it's as random as possible. A random Superhero name combined with the current
      # timestamp should do.
      let(:group_name) { "t_xi_1666987811" }
      let(:group_description) { "Laborum debitis quibusdam. Quaerat voluptatem incidunt. Harum vero sint." }

        before do
          # fill in group
          fill_in 'Name', with: group_name
          check 'System Level Group?'
          fill_in 'Description', with: group_description
          allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_access_token')
          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_system_level_vcr", record: :none) do
            page.find('.select2-search__field').native.send_keys('rarxd5taqea')

            page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          end

          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_system_level_vcr", record: :none) do
            page.find('.select2-search__field').native.send_keys('qhw5mjoxgs2vjptmvzco')

            page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          end

          VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_system_level_vcr", record: :none) do
            page.find('.select2-search__field').native.send_keys('q6ddmkhivmuhk')

            page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          end

          within '.group-form' do
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_system_level_vcr", record: :none) do
              click_on 'Submit'
            end
          end

        wait_for_cmr
      end

      it 'redirects to the group show page and shows the system level group information' do
        expect(page).to have_content('Group was successfully created.')
        expect(page).to have_content(group_name)
        expect(page).to have_content(group_description)

          # SYS badge
          expect(page).to have_content('SYS')
          expect(page).to have_css('span.eui-badge--sm')

        within '#group-members' do
          expect(page).to have_selector('tbody > tr', count: 3)

          expect(page).to have_content('Execktamwrwcqs 02Wvhznnzjtrunff')
          expect(page).to have_content('06dutmtxyfxma Sppfwzsbwz')
          expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
        end
      end
    end
  end
end
