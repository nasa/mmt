describe 'Tool draft deletion', js: true do
  let(:draft) { create(:full_tool_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
    visit tool_draft_path(draft)
  end

  context 'when adding and deleting a single draft' do
    before do
      within '.action' do
        click_on 'Delete Tool Draft'
        # Accept
        click_on 'Yes'
      end
    end

    # needs the index page
    # it 'displays a confirmation message and returns to the drafts index page' do
    #   expect(page).to have_content('Tool Draft Deleted Successfully!')
    #
    #   expect(page).to have_content('MMT_2 Tool Drafts')
    # end
  end

  context 'when cancelling the deletion of a single draft' do
    before do
      within '.action' do
        click_on 'Delete Tool Draft'
        # Reject
        click_on 'No'
      end
    end

    it 'does NOT return to the drafts index page' do
      expect(page).to_not have_content('MMT_2 Tool Drafts')
    end
  end
end
