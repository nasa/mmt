describe 'Valid Service Service Information Preview', reset_provider: true do
  before :all do
    @ingest_response, @concept_response = publish_service_draft
  end

  before do
    login
    visit service_path(@ingest_response['concept-id'])
  end

  context 'When examining the Service Information section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.service_information' do
        expect(page).to have_css('.umm-preview-field-container', count: 8)

        within '#service_name_preview' do
          expect(page).to have_css('h5', text: 'Name')

          expect(page).to have_css('p', text: @concept_response.body['Name'])
        end

        within '#service_long_name_preview' do
          expect(page).to have_css('h5', text: 'Long Name')

          expect(page).to have_css('p', text: @concept_response.body['LongName'])
        end

        within '#service_type_preview' do
          expect(page).to have_css('h5', text: 'Type')

          expect(page).to have_css('p', text: @concept_response.body['Type'])
        end

        within '#service_version_preview' do
          expect(page).to have_css('h5', text: 'Version')

          expect(page).to have_css('p', text: @concept_response.body['Version'])
        end

        within '#service_version_description_preview' do
          expect(page).to have_css('h5', text: 'Version Description')

          expect(page).to have_css('p', text: @concept_response.body['VersionDescription'])
        end

        within '#service_last_updated_date_preview' do
          expect(page).to have_css('h5', text: 'Last Updated Date')

          expect(page).to have_css('p', text: @concept_response.body['LastUpdatedDate'])
        end

        within '#service_description_preview' do
          expect(page).to have_css('h5', text: 'Description')

          expect(page).to have_css('p', text: @concept_response.body['Description'])
        end

        within '#service_url_preview' do

          within '.card-header' do
            expect(page).to have_css('h5', text: @concept_response.body['URL']['URLContentType'])
          end

          within '.card-body' do
            expect(page).to have_css('p', text: @concept_response.body['URL']['Description'])
            expect(page).to have_link(nil, href: @concept_response.body['URL']['URLValue'])
            expect(page).to have_css('li', text: @concept_response.body['URL']['Type'])
            expect(page).to have_css('li', text: @concept_response.body['URL']['Subtype'])
          end
        end
      end
    end
  end
end
