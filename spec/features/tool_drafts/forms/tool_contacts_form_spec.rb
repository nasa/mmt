describe 'Tool Contacts Form', js: true do
  before do
    login
    draft = create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first)
    visit edit_tool_draft_path(draft, 'tool_contacts')

    click_on 'Expand All'
  end

  context 'when viewing the form with no values' do
    it 'displays the correct title' do
      within 'header .collection-basics > h2' do
        expect(page).to have_content('Tool Contacts')
      end
    end

    it 'displays the form title in the breadcrumbs' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Tool Drafts')
        expect(page).to have_content('Tool Contacts')
      end
    end

    it 'displays the correct sections' do
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Contact Groups')
      expect(page).to have_css('.eui-accordion__header > h3', text: 'Contact Persons')
    end

    it 'displays the correct number of required fields' do
      expect(page).to have_no_selector('label.eui-required-o')
    end

    it 'displays the correct buttons to add another element' do
      expect(page).to have_selector(:link_or_button, 'Add another Contact Person')
      expect(page).to have_selector(:link_or_button, 'Add another Contact Group')
      expect(page).to have_selector(:link_or_button, 'Add another Contact Mechanism', count: 2)
      expect(page).to have_selector(:link_or_button, 'Add another Address', count: 2)
    end

    it 'displays the correct prompt value for all select elements' do
      within '.umm-form' do
        expect(page).to have_select('tool_draft_draft_contact_groups_0_contact_information_contact_mechanisms_0_type', selected: 'Select a Type')
        expect(page).to have_select('tool_draft_draft_contact_groups_0_contact_information_addresses_0_country', selected: 'Select a Country')
        expect(page).to have_select('tool_draft_draft_contact_persons_0_contact_information_contact_mechanisms_0_type', selected: 'Select a Type')
        expect(page).to have_select('tool_draft_draft_contact_persons_0_contact_information_addresses_0_country', selected: 'Select a Country')
      end
    end
  end

  context 'when filling out the form' do
    before do
      within '#contact-groups' do
        add_tool_contact_groups
      end

      within '#contact-persons' do
        add_tool_contact_persons
      end

      within '.nav-top' do
        click_on 'Save'
      end
    end

    context "when clicking 'Save' to save the form" do
      before do
        within '.nav-top' do
          click_on 'Save'
        end
        click_on 'Expand All'
      end

      it 'saves the values, displays a confirmation message, and repopulates the form' do
        expect(page).to have_content('Tool Draft Updated Successfully!')

        within '#contact-groups' do
          tool_contact_groups_assertions
        end

        within '#contact-persons' do
          tool_contact_persons_assertions
        end
      end

      it 'displays the correct number of required fields' do
        expect(page).to have_selector('label.eui-required-o', count: 16)
      end
    end
  end
end
