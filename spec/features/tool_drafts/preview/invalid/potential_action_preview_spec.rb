describe 'Invalid Tool Draft Smart Handoff Information Preview',js: true do
  let(:tool_draft) { create(:invalid_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Potential Action sections'  do
    context 'when examining the progress circles section' do
      it 'displays the form title as an edit link' do
        within '#potential_action-progress' do
          expect(page).to have_link('Potential Action', href: edit_tool_draft_path(tool_draft, 'potential_action'))
        end
      end

      it 'displays the correct status icon' do
        within '#potential_action-progress' do
          within '.status' do
            expect(page).to have_css('.eui-icon.icon-green.eui-fa-circle-o')
          end
        end
      end

      it 'displays the correct progress indicators for non required fields' do
        within '#potential_action-progress .progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-fa-minus-circle.icon-red.potential-action')
          expect(page).to have_link(nil, href: edit_tool_draft_path(tool_draft, 'potential_action', anchor: 'potential-action'))
        end
      end
    end
  end
end
