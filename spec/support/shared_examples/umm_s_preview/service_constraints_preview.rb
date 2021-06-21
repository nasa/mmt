shared_examples_for 'Service Constraints Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_constraints' do
      # Grouped fields cause n + 1 preview containers
      expect(page).to have_css('.umm-preview-field-container', count: 4)

      within '#service_access_constraints_preview, #service_draft_draft_access_constraints_preview' do
        expect(page).to have_css('h5', text: 'Access Constraints')

        expect(page).to have_css('p', text: draft['AccessConstraints'])
      end

      within '#service_use_constraints_preview, #service_draft_draft_use_constraints_preview' do
        expect(page).to have_css('h5', text: 'Use Constraints')

        expect(page).to have_css('h5', text: 'License Url')
        expect(page).to have_css('p', text: draft['UseConstraints']['LicenseUrl'])

        expect(page).to have_css('h5', text: 'License Text')
        expect(page).to have_css('p', text: draft['UseConstraints']['LicenseText'])
      end
    end
  end
end
