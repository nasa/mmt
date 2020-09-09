describe 'Create new draft from variable', reset_provider: true do
  before :all do
    @collection_ingest_response, _collection_concept_response = publish_collection_draft
  end
  before do
    login
  end

  context 'when making a draft from a published variable' do
    before :all do
      @ingest_response, _concept_response = publish_variable_draft(name: 'Test Edit Variable Name', collection_concept_id: @collection_ingest_response['concept-id'])
    end

    before do
      visit variable_path(@ingest_response['concept-id'])

      click_on 'Edit Variable Record'
    end

    it 'displays a confirmation message on the variable draft preview page' do
      expect(page).to have_content('Variable Draft Created Successfully!')

      expect(page).to have_link('Publish Variable Draft')
      expect(page).to have_content('Test Edit Variable Name')
    end

    it 'displays the Collection Association progress icons correctly' do
      within '#collection-association-progress' do
        within '.status' do
          expect(page).to have_css('.eui-icon.icon-green.eui-check')
        end

        within '.progress-indicators' do
          expect(page).to have_css('.eui-icon.eui-required.icon-green.collection_association')
        end
      end
    end

    it 'the draft has the same collection association as the published variable' do
      draft = VariableDraft.last
      expect(draft.collection_concept_id).to eq(@collection_ingest_response['concept-id'])
    end

    context 'when clicking on the Collection Association form link' do
      # this is temporarily blocked so we should test it is blocked correctly
      before do
        click_on 'Collection Association'
      end

      it 'displays a modal indicating that the Collection Association cannot be modified' do
        expect(page).to have_content("This Variable Draft is associated with a published Variable. Modifying a Variable's Collection Association is temporarily disabled.")

        expect(page).to have_content('Publish Variable Draft')
        expect(page).to have_content('Metadata Fields')
        expect(page).to have_content('Variable Information')

        expect(page).to have_no_content('Collection Association Search')
        expect(page).to have_no_css('#variable-draft-collection-association-table')
        expect(page).to have_no_select('Search Field')
        expect(page).to have_no_css("input[id$='query_text']")
      end
    end

    context 'when attempting to visit the collection association form directly' do
      # this is temporarily blocked so we should test it is blocked correctly
      before do
        collection_association_link = page.current_path + '/collection_search'
        visit collection_association_link
      end

      it 'does not display the Collection Association Form' do
        expect(page).to have_content('Publish Variable Draft')
        expect(page).to have_content('Metadata Fields')
        expect(page).to have_content('Variable Information')

        expect(page).to have_no_content('Collection Association Search')
        expect(page).to have_no_css('#variable-draft-collection-association-table')
        expect(page).to have_no_select('Search Field')
        expect(page).to have_no_css("input[id$='query_text']")
      end
    end
  end

  context 'when working with the draft of a published variable' do
    before :all do
      @native_id = 'TestVariableNativeId'
      ingest_response, _concept_response = publish_variable_draft(name: 'Test Edit Variable Name 2', native_id: @native_id, collection_concept_id: @collection_ingest_response['concept-id'])
    end

    context 'when trying to publish/update a variable draft with a different name' do
      before do
        @variable_draft = create(:full_variable_draft, native_id: @native_id, draft_short_name: 'An Incompatible Name', collection_concept_id: @collection_ingest_response['concept-id'])
        visit variable_draft_path(@variable_draft)
        click_on 'Publish Variable Draft'
      end

      it 'does not succeed' do
        expect(page).to have_content('Variable Draft was not published successfully. Variable name [An Incompatible Name] does not match the existing variable name [Test Edit Variable Name 2]')
      end
    end
  end
end
