describe 'Empty Service Draft Service Identification Preview' do
  let(:service_draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examining the Service Identification section' do
    it 'displays the form title as an edit link' do
      within '#service_identification-progress' do
        expect(page).to have_link('Service Identification', href: edit_service_draft_path(service_draft, 'service_identification'))
      end
    end
  end

  it 'displays the correct status icon' do
    within '#service_identification-progress' do
      within '.status' do
        expect(page).to have_content('Service Identification is valid')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#service_identification-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.service-quality')
      expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.access-constraints')
      expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.use-constraints')
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_identification', anchor: 'service-quality'))
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_identification', anchor: 'access-constraints'))
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_identification', anchor: 'use-constraints'))
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_identification' do
      expect(page).to have_css('.umm-preview-field-container', count: 3)

      within '#service_draft_draft_service_quality_preview' do
        expect(page).to have_css('h5', text: 'Service Quality')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_identification', anchor: 'service_draft_draft_service_quality'))

        expect(page).to have_css('p', text: 'No value for Service Quality provided.')
      end

      within '#service_draft_draft_access_constraints_preview' do
        expect(page).to have_css('h5', text: 'Access Constraints')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_identification', anchor: 'service_draft_draft_access_constraints'))

        expect(page).to have_css('p', text: 'No value for Access Constraints provided.')
      end

      within '#service_draft_draft_use_constraints_preview' do
        expect(page).to have_css('h5', text: 'Use Constraints')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_identification', anchor: 'service_draft_draft_use_constraints'))

        expect(page).to have_css('p', text: 'No value for Use Constraints provided.')
      end
    end
  end
end
