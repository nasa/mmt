describe 'Groups', reset_provider: true do
  context 'when visiting the new group form' do
    before do
      # Rails.cache.clear
      login

      visit new_group_path
    end

    it 'displays the new group form' do
      expect(page).to have_content('New MMT_2 Group')

      expect(page).to have_field('Name', type: 'text')
      expect(page).to have_field('Description', type: 'textarea')

      expect(page).to have_no_unchecked_field('System Level Group?')
    end

    context 'when submitting an invalid group form', js: true do
      before do
        within '.group-form' do
          click_on 'Submit'
        end
      end

      it 'displays validation errors within the form' do
        expect(page).to have_content('Name is required.')
        expect(page).to have_content('Description is required.')
      end
    end

    context 'when submitting the form without errors' do
      before :all do
        visit new_group_path
      end

      context 'when submitting the form with members', js: true do
        let(:group_name)        { 'NASA_Test_Group_With_Members' }
        let(:group_description) { 'NASA is seriously the coolest, with the coolest members!' }

        before do
          fill_in 'Name', with: group_name
          fill_in 'Description', with: group_description

          VCR.use_cassette('urs/search/rarxd5taqea', record: :none) do
            page.find('.select2-search__field').native.send_keys('rarxd5taqea')

            page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          end

          VCR.use_cassette('urs/search/qhw5mjoxgs2vjptmvzco', record: :none) do
            page.find('.select2-search__field').native.send_keys('qhw5mjoxgs2vjptmvzco')

            page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          end

          VCR.use_cassette('urs/search/q6ddmkhivmuhk', record: :none) do
            page.find('.select2-search__field').native.send_keys('q6ddmkhivmuhk')

            page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          end

          within '.group-form' do

            VCR.use_cassette("edl/urs/multiple_users/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              click_on 'Submit'
            end
          end

          wait_for_cmr
        end

        it 'saves the group with members' do
          expect(page).to have_content('Group was successfully created.')

          within '#group-members' do
            expect(page).to have_selector('tbody > tr', count: 3)

            expect(page).to have_content('Execktamwrwcqs 02Wvhznnzjtrunff')
            expect(page).to have_content('06dutmtxyfxma Sppfwzsbwz')
            expect(page).to have_content('Rvrhzxhtra Vetxvbpmxf')
          end
        end
      end

      context 'when submitting the form without members' do
        let(:group_name)        { 'NASA_Test_Group_no_members_1' }
        let(:group_description) { 'NASA is seriously the coolest_1.' }

        before do
          fill_in 'Name', with: group_name
          fill_in 'Description', with: group_description

          within '.group-form' do

            VCR.use_cassette("edl/urs/without_users/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              click_on 'Submit'
            end
          end

          wait_for_cmr
        end

        it 'saves the group without members' do
          expect(page).to have_content('Group was successfully created.')

          expect(page).not_to have_selector('table.group-members')
          expect(page).to have_content("#{group_name} has no members.")
        end
      end
    end
  end
end
