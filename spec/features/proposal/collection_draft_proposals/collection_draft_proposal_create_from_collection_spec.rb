describe 'Collection Draft Proposal creation from collection', js: true do
  before do
    login
  end

  context 'when viewing a collection' do
    before do
      @ingest_response, _concept_response = publish_collection_draft
      set_as_proposal_mode_mmt(with_required_acl: true)
      visit collection_path(@ingest_response['concept-id'])
    end

    it 'displays the proposal actions' do
      expect(page).to have_link('Create Update Request')
      expect(page).to have_link('Submit Delete Request')
    end

    context 'when creating a delete metadata proposal' do
      before do
        click_on 'Submit Delete Request'
        click_on 'Yes'
      end

      it 'a delete metadata proposal can be created' do
        expect(page).to have_content('Collection Metadata Delete Request Created Successfully!')
        expect(page).to have_content('Submitted')
      end
    end

    context 'when creating an update metadata proposal' do
      before do
        click_on 'Create Update Request'
        click_on 'Yes'
      end

      it 'an update metadata proposal can be created' do
        expect(page).to have_content('Collection Metadata Update Request Created Successfully!')
        expect(page).to have_content('In Work')
      end
    end
  end
end
