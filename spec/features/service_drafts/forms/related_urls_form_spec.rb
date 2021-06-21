describe 'Service Drafts Related URLs form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'related_urls')
    click_on 'Expand All'
  end

  context 'when viewing the form with no values' do
    it 'does not display required icons for accordions in Related URLs section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Related URLs')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Related URLs')
      end
    end

    it 'displays the correct sections' do
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Related URLs')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'displays the correct buttons to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Related URL')
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('service_draft_draft_related_urls_0_url_content_type', selected: ['Select a Url Content Type'])
        expect(page).to have_select('service_draft_draft_related_urls_0_type', selected: 'Select Type', disabled: true)
        expect(page).to have_select('service_draft_draft_related_urls_0_subtype', selected: 'Select a Subtype', disabled: true)
      end
    end
  end

  context 'when filling out the form' do
    before do
      within '.multiple > .multiple-item-0' do
        fill_in 'Description', with: 'A Table listing of what data subsetting, reformatting, and reprojection services are available for SMAP data.'
        select 'Publication URL', from: 'URL Content Type'
        select 'View Related Information', from: 'Type'
        select 'General Documentation', from: 'Subtype'
        fill_in 'URL', with: 'https://nsidc.org/support/how/what-data-subsetting-reformatting-and-reprojection-services-are-available-smap-data'
      end

      click_on 'Add another Related URL'

      within '.multiple > .multiple-item-1' do
        fill_in 'Description', with: 'Test another related url'
        select 'Publication URL', from: 'URL Content Type'
        select 'Algorithm Documentation', from: 'Subtype'
        fill_in 'URL', with: 'algorithms.org'
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_css('label.eui-required-o', count: 6)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Service Draft Updated Successfully!')

        within '.multiple .multiple-item-0' do
          expect(page).to have_field('Description', with: 'A Table listing of what data subsetting, reformatting, and reprojection services are available for SMAP data.')
          expect(page).to have_select('URL Content Type', selected: 'Publication URL')
          expect(page).to have_select('Type', selected: 'View Related Information')
          expect(page).to have_select('Subtype', selected: 'General Documentation')
          expect(page).to have_field('URL', with: 'https://nsidc.org/support/how/what-data-subsetting-reformatting-and-reprojection-services-are-available-smap-data')
        end

        within '.multiple .multiple-item-1' do
          expect(page).to have_field('Description', with: 'Test another related url')
          expect(page).to have_select('URL Content Type', selected: 'Publication URL')
          expect(page).to have_select('Type', selected: 'View Related Information')
          expect(page).to have_select('Subtype', selected: 'Algorithm Documentation')
          expect(page).to have_field('URL', with: 'algorithms.org')
        end
      end
    end
  end
end
