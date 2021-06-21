describe 'Service Drafts Service Contacts Form', js: true do
  before do
    login
    draft = create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_service_draft_path(draft, 'service_contacts')
    click_on 'Expand All'
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Service Contacts')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('Service Contacts')
      end
    end

    it 'displays the correct sections' do
      within '.umm-form' do
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Contact Groups')
        expect(page).to have_css('.eui-accordion__header > h3', text: 'Contact Persons')
      end
    end

    it 'displays required icons for accordions on the Service Information form' do
      expect(page).to have_no_selector('h3.eui-required-o.always-required')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'displays the correct buttons to add another element' do
      within '#contact-groups' do
        expect(page).to have_selector(:link_or_button, 'Add another Contact Mechanism')
        expect(page).to have_selector(:link_or_button, 'Add another Address')
        expect(page).to have_selector(:link_or_button, 'Add another Online Resource')
        expect(page).to have_selector(:link_or_button, 'Add another Contact Group')
      end

      within '#contact-persons' do
        expect(page).to have_selector(:link_or_button, 'Add another Contact Mechanism')
        expect(page).to have_selector(:link_or_button, 'Add another Address')
        expect(page).to have_selector(:link_or_button, 'Add another Online Resource')
        expect(page).to have_selector(:link_or_button, 'Add another Contact Person')
      end
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        within '#contact-groups' do
          expect(page).to have_select('service_draft_draft_contact_groups_0_contact_information_contact_mechanisms_0_type', selected: ['Select a Type'])
        end

        within '#contact-persons' do
          expect(page).to have_select('service_draft_draft_contact_persons_0_contact_information_contact_mechanisms_0_type', selected: ['Select a Type'])
        end
      end
    end
  end

  context 'when filling out the form' do
    before do
      add_service_contact_groups
      add_service_contact_persons
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end

        click_on 'Expand All'
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_css('label.eui-required-o', count: 34)
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Service Draft Updated Successfully!')

        service_contact_groups_assertions
        service_contact_persons_assertions
      end
    end
  end
end
