describe 'Service Drafts Service Information Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft)
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Service Information')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Service Information')
      end
    end

    it 'displays the correct sections' do
      within '.umm-form' do
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Service Information')
        expect(page).to have_css('.eui-accordion__header > h3', text: 'URL')
      end
    end

    it 'does not display required icons for accordions on the Service Information form' do
      expect(page).to have_css('h3.eui-required-o.always-required', count: 2)
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_css('label.eui-required-o', count: 6)
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('service_draft_draft_type', selected: ['Select a Type'])
      end
    end
  end

  context 'when filling out the form' do
    before do
      within '#service-information' do
        fill_in 'Name', with: 'Service Name'
        fill_in 'Long Name', with: 'Long Service Name'
        select 'NOT PROVIDED', from: 'Type'
        fill_in 'Version', with: '1.0'
        fill_in 'Version Description', with: 'Description of the Current Version'
        fill_in 'Last Updated Date', with: '2020-05-20T00:00:00.000Z'
        fill_in 'service_draft_draft_description', with: 'Description of the test service'
      end

      within '#url' do
        fill_in 'Description', with: 'Description of primary url'
        fill_in 'URL Value', with: 'httpx://testurl.earthdata.nasa.gov'
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_selector('label.eui-required-o', count: 6)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Service Draft Updated Successfully!')

        within '#service-information' do
          expect(page).to have_field('Name', with: 'Service Name')
          expect(page).to have_field('Long Name', with: 'Long Service Name')
          expect(page).to have_field('Type', with: 'NOT PROVIDED')
          expect(page).to have_field('Version', with: '1.0')
          expect(page).to have_field('Version Description', with: 'Description of the Current Version')
          expect(page).to have_field('Last Updated Date', with: '2020-05-20T00:00:00.000Z')
          expect(page).to have_field('Description', with: 'Description of the test service')
        end

        within '#url' do
          expect(page).to have_field('Description', with: 'Description of primary url')
          expect(page).to have_field('URL Value', with: 'httpx://testurl.earthdata.nasa.gov')
        end
      end
    end
  end
end
