shared_examples_for 'Service Related URLs Full Preview' do
  it 'displays the stored values correctly within the preview' do
    within '.umm-preview.related_urls' do
      expect(page).to have_css('h4', text: 'Related URLs')

      expect(page).to have_css('.umm-preview-field-container', count: 1)

      within '#service_related_urls_preview, #service_draft_draft_related_urls_preview' do

        within 'ul.related-url-cards' do
          within 'li.card:nth-child(1)' do
            within '.card-header' do
              expect(page).to have_css('h5', text: 'PublicationURL')
            end

            within '.card-body' do
              expect(page).to have_css('p', text: 'Test related url')
              expect(page).to have_link(nil, href: 'https://nsidc.org/support/how/what-data-subsetting-reformatting-and-reprojection-services-are-available-smap-data')
              expect(page).to have_css('li.arrow-tag-group-item', text: 'VIEW RELATED INFORMATION')
              expect(page).to have_css('li.arrow-tag-group-item', text: 'GENERAL DOCUMENTATION')
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
