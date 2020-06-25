describe 'Valid Tool Draft Related URL Preview' do
  let(:tool_draft) { create(:full_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Related URL sections' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#related_urls-progress' do
          expect(page).to have_link('Related URL', href: edit_tool_draft_path(tool_draft, 'related_urls'))
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
        end
      end
    end

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.related_urls' do
          expect(page).to have_css('h4', text: 'Related URLs')

          expect(page).to have_css('.umm-preview-field-container', count: 1)

          within '#tool_draft_draft_related_urls_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'related_urls', anchor: 'tool_draft_draft_related_urls'))

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
end
