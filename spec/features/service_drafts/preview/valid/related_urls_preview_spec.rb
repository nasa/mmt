describe 'Valid Tool Draft Related URL Preview' do
  let(:service_draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit service_draft_path(service_draft)
  end

  context 'when examining the Related URL sections' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#related_urls-progress' do
          expect(page).to have_link('Related URL', href: edit_service_draft_path(service_draft, 'related_urls'))
        end
      end

      it 'displays the correct status icon' do
        within '#related_urls-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-check', text: 'Related URLs is valid')
          end
        end
      end

      it 'displays the correct progress indicators for non required fields' do
        within '#related_urls-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.related-urls')
          expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'related_urls', anchor: 'related-urls'))
        end
      end
    end

    context 'when examining the metadata preview section' do
      include_examples 'Service Related URLs Full Preview'

      it 'displays links to edit/update the data' do
        within '.umm-preview.related_urls' do
          expect(page).to have_css('.umm-preview-field-container', count: 1)

          within '#service_draft_draft_related_urls_preview' do
            expect(page).to have_link(nil, href: edit_service_draft_path(service_draft, 'related_urls', anchor: 'service_draft_draft_related_urls'))

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
  end
end
