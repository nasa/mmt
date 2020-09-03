describe 'Publishing variable draft records' do
  before :all do
    @ingest_collection_response, _collection_concept_response = publish_collection_draft
  end

  context 'when publishing a variable draft record' do
    before do
      login
      draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first, draft_short_name: '12345', draft_entry_title: 'Draft Title', collection_concept_id: @ingest_collection_response['concept-id'])
      visit variable_draft_path(draft)
      click_on 'Publish Variable Draft'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Variable Draft Published Successfully!')
    end
  end

  context 'when publishing an incomplete record', js: true do
    before do
      login
      draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
      visit variable_draft_path(draft)
      click_on 'Publish Variable Draft'
    end

    it 'displays a message to the user' do
      message = 'This variable draft is not ready to be published. Please use the progress indicators on the draft preview page to address incomplete or invalid fields.'
      expect(page).to have_content(message)
    end
  end
end
