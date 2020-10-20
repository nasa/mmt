describe 'Associating a collection upon variable draft creation', js: true do
  let(:collection_concept_id)           { cmr_client.get_collections({'EntryTitle': 'Anthropogenic Biomes of the World, Version 2: 1700'}).body.dig('items',0,'meta','concept-id') }
  let(:not_current_provider_concept_id) { cmr_client.get_collections({'EntryTitle': 'MISR Level 1B1 Radiance Data V002'}).body.dig('items',0,'meta','concept-id') }
  let(:not_found_concept_id)            { 'C1-NOTFOUND' }
  let(:invalid_concept_id)              { 'asdf' }
  let(:variable_draft)                  { VariableDraft.last }

  before do
    login(provider: 'SEDAC', providers: %w(SEDAC LARC))
  end

  context 'when creating a variable draft and associating a collection from the manage variables page' do
    before do
      visit manage_variables_path
    end

    context 'when the supplied concept-id is successfully found' do
      before do
        fill_in 'associated_collection_id', with: collection_concept_id
        click_on 'Create New Record'
        within '.nav-top' do
          click_on 'Done'
        end
        within '#invalid-draft-modal.eui-modal-content' do
          click_on 'Yes'
        end
      end

      it 'associates the collection upon draft creation' do
        expect(variable_draft.collection_concept_id).to eq(collection_concept_id)
      end
    end

    context 'when the supplied concept-id is not found' do
      before do
        fill_in 'associated_collection_id', with: not_found_concept_id
        click_on 'Create New Record'
      end

      it 'does not navigate to the new_variable_draft_path' do
        expect(page).to have_no_content('Variable Information')
        expect(page).to have_no_css('.umm-form')
        expect(page).to have_no_css('.variable-form')
        expect(page).to have_content('Create Variable Record')
        expect(page).to have_content('(Optional) Enter the Concept ID of the collection to associate this variable:')
      end

      it 'notifies the user that the concept supplied was not found' do
        expect(page).to have_content("No matches were found for #{not_found_concept_id}")
      end
    end

    context 'when the current provider context is not congruent with the supplied concept-id' do
      before do
        fill_in 'associated_collection_id', with: not_current_provider_concept_id
        click_on 'Create New Record'
      end

      it 'does not navigate to the new_variable_draft_path' do
        expect(page).to have_no_content('Variable Information')
        expect(page).to have_no_css('.umm-form')
        expect(page).to have_no_css('.variable-form')
        expect(page).to have_content('Create Variable Record')
        expect(page).to have_content('(Optional) Enter the Concept ID of the collection to associate this variable:')

      end

      it 'notifies the user that the provider context needs to be changed' do
        expect(page).to have_content("Variables can only be associated to collections within the same provider. To create a variable for #{not_current_provider_concept_id} you must change your provider context.")
      end
    end

    context 'when the cmr response for invalid concept-id is unsuccessful' do
      before do
        fill_in 'associated_collection_id', with: invalid_concept_id
        click_on 'Create New Record'
      end

      it 'surfaces the CMR error message' do
        expect(page).to have_content('Concept-id [asdf] is not valid.')
      end

      it 'does not navigate to the new_variable_draft_path' do
        expect(page).to have_no_content('Variable Information')
        expect(page).to have_no_css('.umm-form')
        expect(page).to have_no_css('.variable-form')
      end
    end

    context 'when no concept-id is supplied' do
      before do
        click_on 'Create New Record'
        within '.nav-top' do
          click_on 'Done'
        end
        within '#invalid-draft-modal.eui-modal-content' do
          click_on 'Yes'
        end
      end

      it 'creates a draft with no collection associations' do
        expect(variable_draft.collection_concept_id).to be_nil
      end
    end
  end

  context "when creating a variable draft and associating a collection from the collection's show page" do
    context 'when the provider context does not need to be changed' do
      before do
        visit collection_path(collection_concept_id)
        click_on 'Create Associated Variable'
        within '.nav-top' do
          click_on 'Done'
        end
        within '#invalid-draft-modal.eui-modal-content' do
          click_on 'Yes'
        end
      end

      it 'associates the collection upon draft creation' do
        expect(variable_draft.collection_concept_id).to eq(collection_concept_id)
      end
    end

    context 'when the provider context needs to be changed' do
      before do
        visit collection_path(not_current_provider_concept_id)
        click_on 'Create Associated Variable'
      end

      it 'displays the not-current-provider-modal' do
        within '#not-current-provider-modal' do
          expect(page).to have_content('Creating an associated variable requires you change your provider context to LARC. Would you like to change your provider context and perform this action?')
        end
      end

      context 'user changes provider when prompted by the modal' do
        before do
          within '#not-current-provider-modal' do
            click_on 'Yes'
          end
          within '.nav-top' do
            click_on 'Done'
          end
          within '#invalid-draft-modal.eui-modal-content' do
            click_on 'Yes'
          end
        end

        it 'associates the collection upon draft creation' do
          within '#provider-badge-link' do
            expect(page).to have_content('LARC')
          end
          expect(variable_draft.collection_concept_id).to eq(not_current_provider_concept_id)
        end
      end
    end
  end
end
