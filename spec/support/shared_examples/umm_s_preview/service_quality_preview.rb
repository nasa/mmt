shared_examples_for 'Service Quality Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_quality' do
      # Grouped fields cause n + 1 preview containers
      expect(page).to have_css('.umm-preview-field-container', count: 4)

      within '#service_service_quality_preview, #service_draft_draft_service_quality_preview' do
        expect(page).to have_css('h5', text: 'Service Quality')

        expect(page).to have_css('h5', text: 'Quality Flag')
        expect(page).to have_css('p', text: draft['ServiceQuality']['QualityFlag'])

        expect(page).to have_css('h5', text: 'Traceability')
        expect(page).to have_css('p', text: draft['ServiceQuality']['Traceability'])

        expect(page).to have_css('h5', text: 'Lineage')
        expect(page).to have_css('p', text: draft['ServiceQuality']['Lineage'])
      end
    end
  end
end
