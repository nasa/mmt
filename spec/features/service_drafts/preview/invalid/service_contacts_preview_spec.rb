describe 'Invalid Service Draft Service Contacts Preview' do
  let(:service_draft) { create(:invalid_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Service Contacts section' do
    it 'displays the form title as an edit link' do
      within '#service_contacts-progress' do
        expect(page).to have_link('Service Contacts', href: edit_service_draft_path(service_draft, 'service_contacts'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#service_contacts-progress' do
      within '.status' do
        expect(page).to have_content('Service Contacts is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#service_contacts-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.contact-groups')
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.contact-persons')
    end
  end
end
