describe 'Empty Tool Draft Smart Handoff Information Preview' do
  let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(tool_draft)
  end

  context 'when examining the Smart Handoff Information sections' do

    context 'when examining the metadata preview section' do
      it 'does not display the Smart Handoff Information in the preview' do
        expect(page).to have_no_css('.umm-preview.smart_handoff_information')
      end
    end
  end
end
