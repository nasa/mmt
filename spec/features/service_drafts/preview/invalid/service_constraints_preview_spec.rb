describe 'Invalid Service Draft Service Constraints Preview' do
  let(:service_draft) { create(:invalid_service_draft, user: User.where(urs_uid: 'testuser').first) }
  let(:draft) { service_draft.draft }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'When examining the Service Constraints section' do
    it 'displays the form title as an edit link' do
      within '#service_constraints-progress' do
        expect(page).to have_link('Service Constraints', href: edit_service_draft_path(service_draft, 'service_constraints'))
      end
    end
  end

  it 'displays the correct status icon' do
    within '#service_constraints-progress' do
      within '.status' do
        expect(page).to have_content('Service Constraints is incomplete')
      end
    end
  end

  it 'displays the correct progress indicators for non required fields' do
    within '#service_constraints-progress .progress-indicators' do
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.access-constraints')
      expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.use-constraints')
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_constraints', anchor: 'access-constraints'))
      expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_constraints', anchor: 'use-constraints'))
    end
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_constraints' do
      # Grouped fields cause n + 1 preview containers
      expect(page).to have_css('.umm-preview-field-container', count: 4)

      within '#service_draft_draft_access_constraints_preview' do
        expect(page).to have_css('h5', text: 'Access Constraints')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_constraints', anchor: 'service_draft_draft_access_constraints'))

        expect(page).to have_css('p', text: draft['AccessConstraints'])
      end

      within '#service_draft_draft_use_constraints_preview' do
        expect(page).to have_css('h5', text: 'Use Constraints')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_constraints', anchor: 'service_draft_draft_use_constraints'))

        expect(page).to have_css('h5', text: 'License Url')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_constraints', anchor: 'service_draft_draft_use_constraints_license_url'))
        expect(page).to have_css('p', text: draft['UseConstraints']['LicenseURL'])

        expect(page).to have_css('h5', text: 'License Text')
        expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'service_constraints', anchor: 'service_draft_draft_use_constraints_license_text'))
        expect(page).to have_css('p', text: draft['UseConstraints']['LicenseText'])
      end
    end
  end
end
