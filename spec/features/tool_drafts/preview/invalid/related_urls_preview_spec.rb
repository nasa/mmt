describe 'Invalid Tool Draft Related URL Preview' do
  let(:tool_draft) { create(:invalid_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examing the Related URL sections' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#related_urls-progress' do
          expect(page).to have_link('Related URL', href: edit_tool_draft_path(tool_draft, 'related_urls'))
        end
      end

      it 'displays the corrent status icon' do
        within '#related_urls-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o', text: 'Related URLs is incomplete')
          end
        end
      end

      it 'displays the correct progress indicators for invalid fields' do
        within '#related_urls-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.related-urls')
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
              within 'li.card' do
                within '.card-header' do
                  expect(page).to have_css('h5', text: 'DistributionURL')
                end

                within '.card-body' do
                  expect(page).to have_css('p', text: 'Test related url')
                  expect(page).to have_css('li', text: 'GET SERVICE')
                  expect(page).to have_css('li', text: 'SOFTWARE PACKAGE')
                end
              end
            end
          end
        end
      end
    end
  end
end
