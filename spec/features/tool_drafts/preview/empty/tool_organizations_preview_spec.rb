describe 'Empty Tool Draft Tool Organizations Preview' do
  let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Tool Organizations sections' do

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.tool_organizations' do
          expect(page).to have_css('h4', text: 'Tool Organizations')

          expect(page).to have_css('.umm-preview-field-container', count: 1)

          within '#tool_draft_draft_organizations_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_organizations', anchor: 'tool_draft_draft_organizations'))

            expect(page).to have_css('p', text: 'No value for Organizations provided.')
          end
        end
      end
    end
  end
end
