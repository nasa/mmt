describe 'Empty Service Draft Service Quality Preview' do
  let(:service_draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examining the Service Quality section' do
    it 'displays the form title as an edit link' do
      within '#service_quality-progress' do
      expect(page).to have_link('Service Quality', href: edit_service_draft_path(service_draft, 'service_quality'))
      end
    end
  end

  it 'displays the correct status icon' do
    within '#service_quality-progress' do
      within '.status' do
        expect(page).to have_content('Service Quality is valid')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#service_quality-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.service-quality')
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service-quality'))
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_quality' do
      expect(page).to have_css('.umm-preview-field-container', count: 1)

      within '#service_draft_draft_service_quality_preview' do
        expect(page).to have_css('h5', text: 'Service Quality')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service_draft_draft_service_quality'))

        expect(page).to have_css('p', text: 'No value for Service Quality provided.')
      end
    end
  end
end
