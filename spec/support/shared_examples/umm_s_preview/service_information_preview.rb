shared_examples_for 'Service Information Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.service_information' do
      expect(page).to have_css('.umm-preview-field-container', count: 10)

      within '#service_name_preview, #service_draft_draft_name_preview' do
        expect(page).to have_css('h5', text: 'Name')

        expect(page).to have_css('p', text: draft['Name'])
      end

      within '#service_long_name_preview, #service_draft_draft_long_name_preview' do
        expect(page).to have_css('h5', text: 'Long Name')

        expect(page).to have_css('p', text: draft['LongName'])
      end

      within '#service_type_preview, #service_draft_draft_type_preview' do
        expect(page).to have_css('h5', text: 'Type')

        expect(page).to have_css('p', text: draft['Type'])
      end

      within '#service_version_preview, #service_draft_draft_version_preview' do
        expect(page).to have_css('h5', text: 'Version')

        expect(page).to have_css('p', text: draft['Version'])
      end

      within '#service_version_description_preview, #service_draft_draft_version_description_preview' do
        expect(page).to have_css('h5', text: 'Version Description')

        expect(page).to have_css('p', text: draft['VersionDescription'])
      end

      within '#service_last_updated_date_preview, #service_draft_draft_last_updated_date_preview' do
        expect(page).to have_css('h5', text: 'Last Updated Date')

        expect(page).to have_css('p', text: draft['LastUpdatedDate'])
      end

      within '#service_description_preview, #service_draft_draft_description_preview' do
        expect(page).to have_css('h5', text: 'Description')

        expect(page).to have_css('p', text: draft['Description'])
      end

      within '#service_url_preview, #service_draft_draft_url_preview' do
        expect(page).to have_css('p', text: draft['URL']['Description'])
        expect(page).to have_link(nil, href: draft['URL']['URLValue'])
      end
    end
  end
end