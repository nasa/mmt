shared_examples_for 'Service Identification Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_identification' do
      # Grouped fields cause n + 1 preview containers
      expect(page).to have_css('.umm-preview-field-container', count: 8)

      within '#service_service_quality_preview, #service_draft_draft_service_quality_preview' do
        expect(page).to have_css('h5', text: 'Service Quality')

        expect(page).to have_css('h5', text: 'Quality Flag')
        expect(page).to have_css('p', text: draft['ServiceQuality']['QualityFlag'])

        expect(page).to have_css('h5', text: 'Traceability')
        expect(page).to have_css('p', text: draft['ServiceQuality']['Traceability'])

        expect(page).to have_css('h5', text: 'Lineage')
        expect(page).to have_css('p', text: draft['ServiceQuality']['Lineage'])
      end

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