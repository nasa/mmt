describe 'Publishing tool draft records' do
  context 'when publishing a tool draft record' do
    let(:tool_draft) { create(:full_tool_draft, user: User.where(urs_uid: 'testuser').first) }
    before do
      login
      visit tool_draft_path(tool_draft)
      click_on 'Publish Tool Draft'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Tool Draft Published Successfully!')
    end
  end

  context 'when publishing an incomplete record', js: true do
    let(:tool_draft) { create(:empty_tool_draft, user: User.where(urs_uid: 'testuser').first) }
    let(:incomplete_message) { 'This tool draft is not ready to be published. Please use the progress indicators on the draft preview page to address incomplete or invalid fields.' }

    before do
      login
      visit tool_draft_path(tool_draft)
      click_on 'Publish Tool Draft'
    end

    it 'displaysa message to the user' do
      expect(page).to have_content(incomplete_message)
    end
  end
end
