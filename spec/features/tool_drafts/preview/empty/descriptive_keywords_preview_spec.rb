describe 'Empty Tool Draft Descriptive Keywords Preview' do
  let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Descriptive Keywords sections' do

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
