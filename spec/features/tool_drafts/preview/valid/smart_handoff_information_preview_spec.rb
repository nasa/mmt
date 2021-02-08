describe 'Valid Tool Draft Smart Handoff Information Preview' do
  let(:tool_draft) { create(:full_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Smart Handoff Information sections' do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#smart_handoff_information-progress' do
          expect(page).to have_link('Smart Handoff Information', href: edit_tool_draft_path(tool_draft, 'smart_handoff_information'))
        end
      end

      it 'displays the correct status icon' do
        within '#smart_handoff_information-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-check', text: 'Smart Handoff Information is valid')
          end
        end
      end

      it 'displays the correct progress indicators for non required fields' do
        within '#smart_handoff_information-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.search-action')
          expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'smart_handoff_information', anchor: 'search-action'))
        end
      end
    end

    context 'when examining the metadata preview section' do
      it 'does not display the Smart Handoff Information in the preview' do
        # Business rules indicate Smart Handoff Information not to be displayed
        expect(page).to have_no_css('.umm-preview.smart_handoff_information')
        expect(page).to have_no_css('h4', text: 'Smart Handoff Information')
      end
    end
  end
end
