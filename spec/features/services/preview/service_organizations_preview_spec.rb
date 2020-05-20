describe 'Valid Service Service Organizations Preview', reset_provider: true do
  before do
    login
    ingest_response, _concept_response = publish_service_draft
    visit service_path(ingest_response['concept-id'])
  end

  context 'When examing the Service Organizations section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.service_organizations' do
        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#service_service_organizations_preview' do
          # TODO: MMT-1997 revisit this test when the preview is updated
          within '.service-organizations-cards' do
            within all('li.card')[0] do
              within '.card-header' do
                expect(page).to have_content('AARHUS-HYDRO')
                expect(page).to have_content('Multiple Roles')
                expect(page).to have_content('DEVELOPER')
                expect(page).to have_content('PUBLISHER')
              end
            end
          end
        end
      end
    end
  end
end
