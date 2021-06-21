describe 'Invalid Service Draft Service Quality Preview' do
  let(:service_draft) { create(:invalid_service_draft, user: User.where(urs_uid: 'testuser').first) }
  let(:draft) { service_draft.draft }

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
        expect(page).to have_content('Service Quality is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#service_quality-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.service-quality')
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service-quality'))
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_quality' do
      # Grouped fields cause n + 1 preview containers
      expect(page).to have_css('.umm-preview-field-container', count: 4)

      within '#service_draft_draft_service_quality_preview' do
        expect(page).to have_css('h5', text: 'Service Quality')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service_draft_draft_service_quality'))

        expect(page).to have_css('h5', text: 'Quality Flag')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service_draft_draft_service_quality_quality_flag'))
        expect(page).to have_css('p', text: 'No value for Quality Flag provided.')

        expect(page).to have_css('h5', text: 'Traceability')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service_draft_draft_service_quality_traceability'))
        expect(page).to have_css('p', text: draft['ServiceQuality']['Traceability'])

        expect(page).to have_css('h5', text: 'Lineage')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_quality', anchor: 'service_draft_draft_service_quality_lineage'))
        expect(page).to have_css('p', text: 'No value for Lineage provided.')
      end
    end
  end
end
