describe 'Listing System Level Groups', reset_provider: true do
  context 'when viewing the index page with a mix of system level and provider level groups', js: true do
    before do
      login_admin(providers: %w[MMT_1 MMT_2 LARC SEDAC NSIDC_ECS])

      VCR.use_cassette('edl', record: :none) do
        visit groups_path

        within '.groups-filters' do
          choose 'Available Providers'
          check 'Show System Groups?'

          click_on 'Apply Filters'
        end
      end
    end

    it 'displays the groups table with the group information' do
      skip #Need to fix content because it actually shows content from SIT

      within '.groups-table' do
        within all('tr')[1] do
          expect(page).to have_content('LARC Admin Group Test group for provider LARC')
        end
        within all('tr')[2] do
          expect(page).to have_content('MMT_1 Admin Group Test group for provider MMT_1')
        end
        within all('tr')[3] do
          expect(page).to have_content('MMT_2 Admin Group Test group for provider MMT_2')
        end
        within all('tr')[4] do
          expect(page).to have_content('NSIDC_ECS Admin Group Test group for provider NSIDC_ECS')
        end
        within all('tr')[5] do
          expect(page).to have_content('SEDAC Admin Group Test group for provider SEDAC')
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
