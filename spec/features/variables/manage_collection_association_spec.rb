describe 'Manage Variable Collection Association', js:true do
  before :all do
    collection_ingest_response, @collection_concept_response = publish_collection_draft
    @collection_ingest_response2, @collection_concept_response2 = publish_collection_draft
    @collection_ingest_response3, @collection_concept_response3 = publish_collection_draft
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
        expect(page).to have_no_link('Add Collection Association')
        expect(page).to have_no_link('Delete Selected Associations')
      end

      it 'displays an update button' do
        expect(page).to have_link('Update Collection Association')
      end

      context 'when searching for a collection to update the collection association' do
        before do
          click_on 'Update Collection Association'

          within '#collection-search' do
            select 'Entry Title', from: 'Search Field'
            find(:css, "input[id$='query_text']").set(@collection_concept_response2.body['EntryTitle'])
            click_button 'Submit'
          end
        end

        it 'displays the collection' do
          within '#collection-search-results' do
            expect(page).to have_content(@collection_concept_response2.body['EntryTitle'])
          end
        end

        context 'when updating the collection association' do
          before do
            within '#collections-select' do
              find("input[value='#{@collection_ingest_response2['concept-id']}']").set(true)

              click_on 'Submit'
            end
            wait_for_cmr
          end

          it 'shows a success message' do
            expect(page).to have_content('Collection Association Updated Successfully!')
          end

          # This test is not consistent without the page refresh because CMR
          # has not always synchronized, even with the wait. Adding this refresh
          # reduced erroneous failures and is explicitly why this link is on the
          # page
        end
      end

      context 'when refreshing the page after updating' do
        before do
          click_on 'Update Collection Association'

          within '#collection-search' do
            select 'Entry Title', from: 'Search Field'
            find(:css, "input[id$='query_text']").set(@collection_concept_response3.body['EntryTitle'])
            click_button 'Submit'
          end

          within '#collections-select' do
            find("input[value='#{@collection_ingest_response3['concept-id']}']").set(true)

            click_on 'Submit'
          end
          wait_for_cmr

          click_on 'refresh the page'
        end

        it 'shows the correct collection' do
          expect(page).to have_content(@collection_concept_response3.body['EntryTitle'])
        end
      end
    end
  end
end
