describe 'Valid Tool Tool Organizations Preview' do
  before :all do
    @ingest_response, _concept_response, @native_id = publish_tool_draft
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

  context 'when examining the Tool Organizations section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.tool_organizations' do
        expect(page).to have_css('h4', text: 'Tool Organizations')

        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#tool_organizations_preview' do
          within 'ul.tool-organizations-cards' do
            within 'li.card:nth-child(1)' do
              within '.card-header' do
                expect(page).to have_content('UCAR/NCAR/EOL/CEOPDM')
                expect(page).to have_content('Multiple Roles')
                expect(page).to have_content('SERVICE PROVIDER')
                expect(page).to have_content('DEVELOPER')
              end

              within '.card-body' do
                within '.card-body-details' do
                  expect(page).to have_content('CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research')
                  expect(page).to have_content('http://www.eol.ucar.edu/projects/ceop/dm/')
                end
              end
            end

            within 'li.card:nth-child(2)' do
              within '.card-header' do
                expect(page).to have_content('AARHUS-HYDRO')
                expect(page).to have_content('PUBLISHER')
              end

              within '.card-body' do
                within '.card-body-details' do
                  expect(page).to have_content('Hydrogeophysics Group, Aarhus University')
                end
              end
            end
          end
        end
      end
    end
  end
end
