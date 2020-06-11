describe 'Empty Tool Draft Descriptive Keywords Preview' do
  let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Descriptive Keywords sections' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#descriptive_keywords-progress' do
          expect(page).to have_link('Descriptive Keywords', href: edit_tool_draft_path(tool_draft, 'descriptive_keywords'))
        end
      end

      it 'displays the correct status icon' do
        within '#descriptive_keywords-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o', text: 'Descriptive Keywords is incomplete')
          end
        end
      end

      it 'displays the correct progress indicators for required fields' do
        within '#descriptive_keywords-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-required-o.icon-green.tool-keywords')
        end
      end

      it 'displays the correct progress indicators for non required fields' do
        within '#descriptive_keywords-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-circle-o.icon-grey.ancillary-keywords')
        end
      end
    end

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.descriptive_keywords' do
          expect(page).to have_css('h4', text: 'Descriptive Keywords')

          expect(page).to have_css('.umm-preview-field-container', count: 2)

          within '#tool_draft_draft_tool_keywords_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'descriptive_keywords', anchor: 'tool_draft_draft_tool_keywords'))

            expect(page).to have_css('p', text: 'No value for Tool Keywords provided.')
          end

          within '#tool_draft_draft_ancillary_keywords_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'descriptive_keywords', anchor: 'tool_draft_draft_ancillary_keywords'))

            expect(page).to have_css('p', text: 'No value for Ancillary Keywords provided.')
          end
        end
      end
    end
  end
end
