describe 'Valid Service Draft Service Contacts Preview' do
  let(:service_draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }
  let(:draft) { service_draft.draft }

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
      expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.contact-groups')
      expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.contact-persons')
    end
  end

  include_examples 'Service Contacts Full Preview' do
    let(:draft) { service_draft.draft }
  end

  it 'has links to edit/update the data' do
    within '#service_draft_draft_contact_groups_preview' do
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_contacts', anchor: 'service_draft_draft_contact_groups'))
    end

    within '#service_draft_draft_contact_persons_preview' do
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_contacts', anchor: 'service_draft_draft_contact_persons'))
    end
  end
end
