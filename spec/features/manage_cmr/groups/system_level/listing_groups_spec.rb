describe 'Listing System Level Groups', reset_provider: true do
  context 'when viewing the index page with a mix of system level and provider level groups', js: true do
    before do
      login_admin(providers: %w[MMT_1 MMT_2 LARC SEDAC NSIDC_ECS])

      # # stub for index groups / get_cmr_groups with a mix of groups
      # index_groups_response = cmr_success_response(File.read('spec/fixtures/groups/sys_groups_index.json'))
      # allow_any_instance_of(Cmr::CmrClient).to receive(:get_cmr_groups).and_return(index_groups_response)

      visit groups_path

      within '.groups-filters' do
        choose 'Available Providers'
        check 'Show System Groups?'

        click_on 'Apply Filters'
      end
    end

    it 'displays the groups table with the group information' do
      within '.groups-table' do
        within all('tr')[1] do
          expect(page).to have_content('LARC Admin Group Test group for provider LARC')
          # expect(page).to have_content('LARC Test Group 01 asdfasdfasd LARC 5')
        end
        within all('tr')[2] do
          expect(page).to have_content('MMT_1 Admin Group Test group for provider MMT_1')
          # expect(page).to have_content('SEDAC Test Group 02 Test group for provider SEDAC 0')
        end
        within all('tr')[3] do
          expect(page).to have_content('MMT_2 Admin Group Test group for provider MMT_2')
        end
        within all('tr')[4] do
          expect(page).to have_content('NSIDC_ECS Admin Group Test group for provider NSIDC_ECS')
        end
        within all('tr')[5] do
          expect(page).to have_content('SEDAC Admin Group Test group for provider SEDAC')
          # expect(page).to have_content('CH mmt2 test system group 03 lalalallalalala MMT_2 4')
        end
        within all('tr')[6] do
          expect(page).to have_content('Administrators SYS CMR Administrators CMR')
          expect(page).to have_css('span.eui-badge--sm')
        end
        within all('tr')[7] do
          expect(page).to have_content('Administrators_2 SYS The group of users that manages the CMR. CMR')
          expect(page).to have_css('span.eui-badge--sm')
        end
      end
    end
  end
end
