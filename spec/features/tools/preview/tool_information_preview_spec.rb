describe 'Valid Tool Tool Information Preview' do
  before :all do
    @ingest_response, @concept_response, @native_id = publish_tool_draft
  end

  before do
    login
    visit tool_path(@ingest_response['concept-id'])
  end

  # TODO: remove after CMR-6332
  after :all do
    delete_response = cmr_client.delete_tool('MMT_2', @native_id, 'token')

    raise unless delete_response.success?
  end

  context 'when examining the Tool Information section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.tool_information' do
        expect(page).to have_css('h4', text: 'Tool Information')

        expect(page).to have_css('.umm-preview-field-container', count: 9)

        within '#tool_name_preview' do
          expect(page).to have_css('h5', text: 'Name')

          expect(page).to have_css('p', text: @concept_response.body['Name'])
        end

        within '#tool_long_name_preview' do
          expect(page).to have_css('h5', text: 'Long Name')

          expect(page).to have_css('p', text: @concept_response.body['LongName'])
        end

        within '#tool_type_preview' do
          expect(page).to have_css('h5', text: 'Type')

          expect(page).to have_css('p', text: @concept_response.body['Type'])
        end

        within '#tool_version_preview' do
          expect(page).to have_css('h5', text: 'Version')

          expect(page).to have_css('p', text: @concept_response.body['Version'])
        end

        within '#tool_version_description_preview' do
          expect(page).to have_css('h5', text: 'Version Description')

          expect(page).to have_css('p', text: @concept_response.body['VersionDescription'])
        end

        within '#tool_last_updated_date_preview' do
          expect(page).to have_css('h5', text: 'Last Updated Date')

          expect(page).to have_css('p', text: @concept_response.body['Last Updated Date'])
        end

        within '#tool_description_preview' do
          expect(page).to have_css('h5', text: 'Description')

          expect(page).to have_css('p', text: @concept_response.body['Description'])
        end

        within '#tool_doi_preview' do
          expect(page).to have_css('h5', text: 'DOI')

          expect(page).to have_css('p', text: @concept_response.body['DOI'])
        end

        within '#tool_url_preview' do
          within '.card-header' do
            expect(page).to have_css('h5', text: 'DistributionURL')
          end

          within '.card-body' do
            expect(page).to have_css('p', text: 'Access the WRS-2 Path/Row to Latitude/Longitude Converter.')
            expect(page).to have_link(nil, href: 'http://www.scp.byu.edu/software/slice_response/Xshape_temp.html')
            expect(page).to have_css('li.arrow-tag-group-item', text: 'DOWNLOAD SOFTWARE')
            expect(page).to have_css('li.arrow-tag-group-item', text: 'MOBILE APP')
          end
        end
      end
    end
  end
end
