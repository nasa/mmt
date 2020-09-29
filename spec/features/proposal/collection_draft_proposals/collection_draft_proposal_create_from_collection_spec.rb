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

      it 'has a submitter_id' do
        expect(CollectionDraftProposal.last.submitter_id).to eq('testuser')
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

  context 'when viewing a collection with service associations' do
    before do
      ingest_response, _concept_response = publish_collection_draft
      @service_ingest_response, service_concept_response = publish_service_draft
      assoc_response = create_service_collection_association(@service_ingest_response['concept-id'], ingest_response['concept-id'])
      set_as_proposal_mode_mmt(with_required_acl: true)
      visit collection_path(ingest_response['concept-id'])

      find('.tab-label', text: 'Services').click
    end

    it 'displays the correct service record link when viewing the collection' do
      expect(page).to have_link('View Service Record', href: "http://localhost:3003/concepts/#{@service_ingest_response['concept-id']}")
    end


    context 'when creating a proposal' do
      before do
        click_on 'Create Update Request'
        click_on 'Yes'

        find('.tab-label', text: 'Services').click
      end

      it 'displays the correct service record link when viewing the proposal' do
        expect(page).to have_link('View Service Record', href: "http://localhost:3003/concepts/#{@service_ingest_response['concept-id']}")
      end
    end
  end
end
