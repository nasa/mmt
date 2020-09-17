describe 'Valid Tool Related URL Preview', reset_provider: true do
  before :all do
    @ingest_response, _concept_response, @native_id = publish_tool_draft
  end

  before do
    login
    visit tool_path(@ingest_response['concept-id'])
  end

  context 'when examining the Related URL section' do
    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.related_urls' do
        expect(page).to have_css('h4', text: 'Related URLs')

        expect(page).to have_css('.umm-preview-field-container', count: 1)

        within '#tool_related_urls_preview' do
          within 'ul.related-url-cards' do
            within 'li.card:nth-child(1)' do
              within '.card-header' do
                expect(page).to have_css('h5', text: 'VisualizationURL')
              end

              within '.card-body' do
                expect(page).to have_css('p', text: 'Test related url')
                expect(page).to have_link(nil, href: 'nasa.gov')
                expect(page).to have_css('li.arrow-tag-group-item', text: 'GET RELATED VISUALIZATION')
                expect(page).to have_css('li.arrow-tag-group-item', text: 'MAP')
              end
            end

            within 'li.card:nth-child(2)' do
              within '.card-header' do
                expect(page).to have_css('h5', text: 'PublicationURL')
              end

              within '.card-body' do
                expect(page).to have_css('p', text: 'Test another related url')
                expect(page).to have_link(nil, href: 'algorithms.org')
                expect(page).to have_css('li.arrow-tag-group-item', text: 'VIEW RELATED INFORMATION')
                expect(page).to have_css('li.arrow-tag-group-item', text: 'ALGORITHM DOCUMENTATION')
              end
            end
          end
        end
      end
    end
  end
end
