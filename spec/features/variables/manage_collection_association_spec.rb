describe 'Manage Variable Collection Association' do
  before :all do
    collection_ingest_response, @collection_concept_response = publish_collection_draft
    @variable_ingest_response, @variable_concept_response = publish_variable_draft(collection_concept_id: collection_ingest_response['concept-id'])
  end

  context 'when viewing a published variable' do
    before do
      login
      visit variable_path(@variable_ingest_response['concept-id'])
    end

    it 'displays a link to get to collection association management' do
      within 'section.action' do
        expect(page).to have_link('Manage Collection Association')
      end
    end

    context 'when visiting the manage collection association page' do
      before do
        click_on 'Manage Collection Association'
      end

      it 'shows the associated collection' do
        expect(page).to have_content("#{@variable_concept_response.body['Name']} Collection Association")

        within '#collection-associations' do
          expect(page).to have_selector('tbody > tr', count: 1)

          within 'tbody tr:nth-child(1)' do
            expect(page).to have_content(@collection_concept_response.body['EntryTitle'])
            expect(page).to have_content(@collection_concept_response.body['ShortName'])
          end
        end
      end

      it 'does not display buttons for blocked actions' do
        expect(page).to have_no_button('Add Collection Association')
        expect(page).to have_no_button('Delete Selected Associations')
      end
    end
  end
end
