describe 'Collection Draft Proposal Update', js: true do
  before do
    login
  end
  context 'when updating an existing collection draft proposal' do
    before do
      set_as_proposal_mode_mmt
      @collection_draft_proposal = create(:full_collection_draft_proposal)
      visit edit_collection_draft_proposal_path(@collection_draft_proposal)
    end

    context 'when updating data' do
      before do
        fill_in 'Short Name', with: '123'
        fill_in 'Abstract', with: 'collection abstract'
        within '.nav-top' do
          click_on 'Save'
        end
      end

      it 'displays a confirmation message' do
        save_screenshot '/tmp/s.png'
        expect(page).to have_content('Collection Draft Proposal Updated Successfully!')
      end
    end
  end
end