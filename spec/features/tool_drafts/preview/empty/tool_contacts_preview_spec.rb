describe 'Empty Tool Draft Tool Contacts Preview' do
  let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Tool Contacts sections' do

    context 'when examining the metadata preview section' do
      it 'displays the stored values correctly within the preview' do
        within '.umm-preview.tool_contacts' do
          expect(page).to have_css('h4', text: 'Tool Contacts')

          expect(page).to have_css('.umm-preview-field-container', count: 2)

          within '#tool_draft_draft_contact_groups_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_contacts', anchor: 'tool_draft_draft_contact_groups'))

            expect(page).to have_css('p', text: 'No value for Contact Groups provided.')
          end

          within '#tool_draft_draft_contact_persons_preview' do
            expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'tool_contacts', anchor: 'tool_draft_draft_contact_persons'))

            expect(page).to have_css('p', text: 'No value for Contact Persons provided.')
          end
        end
      end
    end
  end
end
