describe 'Drafts listed on the Manage Tools page' do
  draft_display_max_count = 5 # Should agree with @draft_display_max_count found in manage_tools_controller

  before do
    @other_user_id = User.create(urs_uid: 'adminuser').id
    @current_user_id = User.create(urs_uid: 'testuser').id

    login
  end

  context 'when no drafts exist' do
    before do
      visit manage_tools_path
    end

    it 'does not display any drafts' do
      expect(page).to have_content('MMT_2 Tool Drafts')

      within '.open-drafts' do
        expect(page).to have_content('MMT_2 has no drafts to display')
      end
    end
  end

  context 'when there are open drafts from multiple users' do
    before do
      # create 2 drafts per user
      2.times { create(:empty_tool_draft, user_id: @current_user_id) }
      2.times { create(:empty_tool_draft, user_id: @other_user_id) }

      visit manage_tools_path
    end

    it 'displays all the drafts' do
      expect(page).to have_content('MMT_2 Tool Drafts')

      within '.open-drafts' do
        expect(page).to have_content('<Blank Name>', count: 4)
      end
    end
  end

  context "when more than #{draft_display_max_count} open drafts exist" do
    before do
      # create draft_display_max_count drafts per user
      draft_display_max_count.times { create(:empty_service_draft, user_id: @current_user_id) }
      draft_display_max_count.times { create(:empty_service_draft, user_id: @other_user_id) }

      visit manage_tools_path
    end

    # TODO this should be available when the index page is added, MMT_2222
    it 'the "More" is displayed' # do
    #   within '.open-drafts' do
    #     expect(page).to have_link('More')
    #   end
    # end
  end
end
