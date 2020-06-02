describe 'Empty Service Draft Service Organizations Preview' do
  let(:service_draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examing the Service Organizations section' do
    it 'displays the form title as an edit link' do
      within '#service_organizations-progress' do
        expect(page).to have_link('Service Organizations', href: edit_service_draft_path(service_draft, 'service_organizations'))
      end
    end
  end

  it 'displays the corrent status icon' do
    within '#service_organizations-progress' do
      within '.status' do
        expect(page).to have_content('Service Organizations is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for required fields' do
    within '#service_organizations-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-required-o.icon-green.service-organizations')
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_organizations' do
      expect(page).to have_css('.umm-preview-field-container', count: 1)

      within '#service_draft_draft_service_organizations_preview' do
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_organizations', anchor: 'service_draft_draft_service_organizations'))

        expect(page).to have_css('p', text: 'No value for Service Organizations provided.')
      end
    end
  end
end
