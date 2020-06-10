describe 'Empty Tool Draft Related URL Preview' do
  let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

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
            expect(page).to have_css('.eui-icon.icon-green.eui-check', text: 'Related URLs is valid')
          end
        end
      end

      it 'displays the correct progress indicators for non required fields' do
        within '#related_urls-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.related-urls')
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

            expect(page).to have_css('p', text: 'No value for Related URLs provided.')
          end
        end
      end
    end
  end
end
