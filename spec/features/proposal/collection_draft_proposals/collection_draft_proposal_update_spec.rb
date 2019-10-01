describe 'Collection Draft Proposal Update', js: true do
  before do
    login
  end
  context 'when updating an existing collection draft proposal' do
    before do
      set_as_proposal_mode_mmt(with_required_acl: true)
      @collection_draft_proposal = create(:full_collection_draft_proposal)
      visit edit_collection_draft_proposal_path(@collection_draft_proposal)
    end

    context 'when updating data' do
      before do
        fill_in 'Short Name', with: 'A Special Short Name'
        fill_in 'Abstract', with: 'collection abstract'
        within '.nav-top' do
          click_on 'Done'
        end
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Proposal Updated Successfully!')
        expect(page).to have_content('A Special Short Name')
        expect(page).to have_content('collection abstract')
      end
    end
  end
end
