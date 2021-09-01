describe 'Chooser expected behaviors', js: true do
  context 'when using the chooser' do
    before do
      login
      visit new_permission_path
      find('#collection_option_selected').click()
    end

    it 'does not click the + button when pressing enter in the left filter box' do
      fill_in('from-filter', with: '\n')
      expect(page).to have_select('Selected Collections', options: [])
    end

    it 'does not click the + button when pressing enter in the right filter box' do
      fill_in('to-filter', with: '\n')
      expect(page).to have_select('Selected Collections', options: [])
    end
  end

  context 'when selecting a collection in the chooser' do
    before do
      ingest_response, concept_response_1 = publish_collection_draft
      @entry_id_1 = "#{concept_response_1.body['ShortName']}_#{concept_response_1.body['Version']} | #{concept_response_1.body['EntryTitle']}"
      login
      visit new_permission_path
      find('#collection_option_selected').click()

      within '#collectionsChooser' do
        select(@entry_id_1, from: 'Available Collections')
        find('.add_button').click
      end
    end

    it 'does not highlight an entry in the right column after using +/-' do
      # must include the icon because the factory generating this collection has s3 prefixes
      expect(page).to have_select('Selected Collections', options: ['🟠 ' + @entry_id_1], selected: [])
      expect(page).to have_no_content('You must select at least 1 collection.')
    end

    it 'does not have an entry highlighted after filling in the filter' do
      within '#collectionsChooser' do
        select(@entry_id_1, from: 'Selected Collections')
      end
      fill_in('to-filter', with: @entry_id_1)

      # must include the icon because the factory generating this collection has s3 prefixes
      expect(page).to have_select('Selected Collections', options: ['🟠 ' + @entry_id_1], selected: [])
    end
  end
end
