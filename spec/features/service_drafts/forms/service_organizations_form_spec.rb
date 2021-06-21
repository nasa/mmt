describe 'Service Drafts Service Organizations Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'service_organizations')
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Service Organizations')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Service Organizations')
      end
    end

    it 'displays the correct sections' do
      within '.umm-form' do
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Service Organizations')
      end
    end

    it 'displays required icons for accordions on the Service Information form' do
      expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_css('label.eui-required-o', count: 2)
    end

    it 'displays the correct buttons to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Service Organization')
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('service_draft_draft_service_organizations_0_short_name', selected: ['Select a Short Name'])
      end
    end
  end

  context 'when filling out the form' do
    before do
      add_service_organizations
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_css('label.eui-required-o', count: 7)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Service Draft Updated Successfully!')

        within '.multiple.service-organizations > .multiple-item-0' do
          expect(page).to have_select('Roles', selected: ['DEVELOPER', 'PUBLISHER'])
          expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
          expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)
        end
        within '.multiple.service-organizations > .multiple-item-1' do
          expect(page).to have_select('Roles', selected: ['DEVELOPER', 'PUBLISHER'])
          expect(page).to have_field('Short Name', with: 'AARHUS-HYDRO')
          expect(page).to have_field('Long Name', with: 'Hydrogeophysics Group, Aarhus University ', readonly: true)
          within '.online-resource' do
            expect(page).to have_field('Name', with: 'ORN Text')
            expect(page).to have_field('Protocol', with: 'ORP Text')
            expect(page).to have_field('Linkage', with: 'ORL Text')
            expect(page).to have_field('Description', with: 'ORD Text')
            expect(page).to have_field('Application Profile', with: 'ORAP Text')
            expect(page).to have_field('Function', with: 'ORF Text')
          end
        end
      end
    end
  end
end
