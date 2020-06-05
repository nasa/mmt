describe 'Valid Service Draft Service Identification Preview' do
  before do
    login
    ingest_response, @concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_identification' do
      # Grouped fields cause n + 1 preview containers
      expect(page).to have_css('.umm-preview-field-container', count: 8)

      within '#service_service_quality_preview' do
        expect(page).to have_css('h5', text: 'Service Quality')

        expect(page).to have_css('h5', text: 'Quality Flag')
        expect(page).to have_css('p', text: @concept_response.body['ServiceQuality']['QualityFlag'])

        expect(page).to have_css('h5', text: 'Traceability')
        expect(page).to have_css('p', text: @concept_response.body['ServiceQuality']['Traceability'])

        expect(page).to have_css('h5', text: 'Lineage')
        expect(page).to have_css('p', text: @concept_response.body['ServiceQuality']['Lineage'])
      end

      within '#service_access_constraints_preview' do
        expect(page).to have_css('h5', text: 'Access Constraints')

        expect(page).to have_css('p', text: @concept_response.body['AccessConstraints'])
      end

      within '#service_use_constraints_preview' do
        expect(page).to have_css('h5', text: 'Use Constraints')

        expect(page).to have_css('h5', text: 'License Url')
        expect(page).to have_css('p', text: @concept_response.body['UseConstraints']['LicenseUrl'])

        expect(page).to have_css('h5', text: 'License Text')
        expect(page).to have_css('p', text: @concept_response.body['UseConstraints']['LicenseText'])
      end
    end
  end
end
