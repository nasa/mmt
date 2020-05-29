describe 'Service Draft creation' do
  before do
    login
  end

  context 'when creating a brand new service draft' do
    before do
      visit new_service_draft_path
    end

    it 'creates a new blank service draft' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('New')
      end
    end

    it 'renders the "Service Information" form' do
      within '.umm-form fieldset h3' do
        expect(page).to have_content('Service Information')
      end
    end

    context 'when saving data into the service draft', js: true do
      before do
        fill_in 'service_draft_draft_name', with: 'test service draft'

        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Service Draft Created Successfully!')
      end

      context "when accessing a service draft's json" do
        before do
          visit service_draft_path(ServiceDraft.first, format: 'json')
        end

        it 'displays json' do
          expect(page).to have_content("{\n  \"Name\": \"test service draft\"\n}")
        end
      end

      context 'when filling in hidden fields' do
        before do
          visit service_draft_path(ServiceDraft.first)
          click_on 'Service Contacts'

          # Expand all accordions, fill in the group name (which should be saved), and select a
          # Distribution URL for URL content type so that 'Get Service' may be chosen from the type element
          # Fill in the full name field in get service, then change the URL content type so that get service
          # is no longer a valid option.  This will result in the fields becoming rehidden (rather than in
          # a closed accordion).  This field should not be saved.
          click_on 'Expand All'
          fill_in 'service_draft_draft_contact_groups_0_group_name', with: 'test service group name'
          select('Distribution URL', from: 'service_draft_draft_contact_persons_0_contact_information_related_urls_0_url_content_type')
          select('Get Service', from: 'service_draft_draft_contact_persons_0_contact_information_related_urls_0_type')
          fill_in 'service_draft_draft_contact_persons_0_contact_information_related_urls_0_get_service_full_name', with: 'Hidden Full Name'
          select('Collection URL', from: 'service_draft_draft_contact_persons_0_contact_information_related_urls_0_url_content_type')
          click_on 'Collapse All'

          within '.nav-top' do
            click_on 'Save'
          end

          click_link 'invalid-draft-accept'
          click_link 'Expand All'
        end

        it 'does not save the hidden fields' do
          expect(page).not_to have_xpath('//input[@value="Hidden Full Name"]')
        end

        it 'does save fields in closed accordians' do
          expect(page).to have_xpath('//input[@value="test service group name"]')
        end
      end
    end
  end
end
