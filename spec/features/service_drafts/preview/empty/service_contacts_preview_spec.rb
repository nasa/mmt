describe 'Empty Service Draft Service Contacts Preview' do
  let(:service_draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examining the Service Contacts section' do
    it 'displays the form title as an edit link' do
      within '#service_contacts-progress' do
        expect(page).to have_link('Service Contacts', href: edit_service_draft_path(service_draft, 'service_contacts'))
      end
    end
  end

  it 'displays the correct status icon' do
    within '#service_contacts-progress' do
      within '.status' do
        expect(page).to have_content('Service Contacts is valid')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#service_contacts-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.contact-groups')
      expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.contact-persons')
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_contacts' do
      expect(page).to have_css('.umm-preview-field-container', count: 2)

      within '#service_draft_draft_contact_groups_preview' do
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_contacts', anchor: 'service_draft_draft_contact_groups'))

        expect(page).to have_css('p', text: 'No value for Contact Groups provided.')
      end

      within '#service_draft_draft_contact_persons_preview' do
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_contacts', anchor: 'service_draft_draft_contact_persons'))

        expect(page).to have_css('p', text: 'No value for Contact Persons provided.')
      end
    end
  end
end
