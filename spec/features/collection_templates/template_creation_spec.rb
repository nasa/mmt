describe 'Create new collection template from cloning a collection', js: true do
  before :all do
    @ingest_response, @concept_response = publish_collection_draft
  end

  context 'when editing a CMR collection' do
    before do
      login

      visit collection_path(@ingest_response['concept-id'])

      click_on 'Save as Template'
    end
  #in wrong provider
    #right message
  #in right provider
end

describe 'Create new collection template from cloning a draft', js: true do
  #click ze button
end

describe 'Create new collection template from scratch', js: true do
  #click ze button
  #error validation
  #invalid template modal
  #go back and try to make another
end

#collection_draft_edit does not have template name
#collection_draft_edit does not lock a user from submitting for not having a template name
