describe 'Valid Service Draft Service Identification Preview' do
  let(:service_draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Service Identification section' do
    it 'displays the form title as an edit link' do
      within '#service_identification-progress' do
        expect(page).to have_link('Service Identification', href: edit_service_draft_path(service_draft, 'service_identification'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#service_identification-progress' do
      within '.status' do
        expect(page).to have_content('Service Identification is valid')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#service_identification-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.service-quality')
      expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.access-constraints')
      expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.use-constraints')
    end
  end
end
