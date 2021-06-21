describe 'Service Drafts Service Constraints form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'service_constraints')
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Service Constraints')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Service Constraints')
      end
    end

    it 'displays the correct sections' do
      within '.umm-form' do
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Access Constraints')
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Use Constraints')
      end
    end

    it 'does not display required icons for accordions on the Service Constraints form' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end
  end

  context 'when filling out the form' do
    before do
      fill_in 'service_draft_draft_access_constraints', with: 'access constraint 1'

      fill_in 'License Url', with: 'LicenseUrl Text'
      fill_in 'License Text', with: 'LicenseText Text'
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Service Draft Updated Successfully!')

        expect(page).to have_field('service_draft_draft_access_constraints', with: 'access constraint 1')

        expect(page).to have_field('service_draft_draft_use_constraints_license_url', with: 'LicenseUrl Text')
        expect(page).to have_field('service_draft_draft_use_constraints_license_text', with: 'LicenseText Text')
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_no_selector('label.eui-required-o')
      end
    end
  end
end
