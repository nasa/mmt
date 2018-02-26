require 'rails_helper'

describe 'Valid Service Service Information Preview', reset_provider: true do
  before do
    login
    ingest_response, @concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  context 'When examining the Service Information section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.service_information' do
        expect(page).to have_css('.umm-preview-field-container', count: 5)

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

        within '#service_description_preview' do
          expect(page).to have_css('h5', text: 'Description')

          expect(page).to have_css('p', text: @concept_response.body['Description'])
        end
      end
    end
  end
end
