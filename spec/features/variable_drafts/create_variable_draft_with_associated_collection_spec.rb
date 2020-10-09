describe 'Associating a collection upon variable draft creation' do
  let(:collection_concept_id)           { cmr_client.get_collections({'EntryTitle': 'Anthropogenic Biomes of the World, Version 2: 1700'}).body.dig('items',0,'meta','concept-id') }
  let(:collection_short_name)           { 'CIESIN_SEDAC_ANTHROMES_v2_1700' }
  let(:not_current_provider_concept_id) { cmr_client.get_collections({'EntryTitle': 'MISR Level 1B1 Radiance Data V002'}).body.dig('items',0,'meta','concept-id') }

  before do
    login(provider: 'SEDAC')
  end

  context 'when creating a variable draft and associating a collection from the manage variables page' do
    before do
      visit manage_variables_path
    end

    context 'when the supplied concept-id is successfully found' do
      before do
        fill_in 'associated_collection_id', with: collection_concept_id
        click_on 'Create New Record'
      end

      it 'associates the collection upon draft creation' do
        within '.nav-top' do
          click_on 'Done'
        end
        # within '#invalid-draft-modal.eui-modal-content' do
        #   click_on 'Yes'
        # end
        within '.collection-association' do
          click_on 'Collection Association'
        end
        within '#variable-draft-collection-association-table tbody' do
          expect(page).to have_content('CIESIN_SEDAC_ANTHROMES_v2_1700')
          expect(page).to have_css('tr', count: 1)
        end
      end
    end

    context 'when the supplied concept-id is not found' do
      before do
        fill_in 'associated_collection_id', with: 'C-INVALID'
        click_on 'Create New Record'
      end

      it 'does not navigate to the new_variable_draft_path' do
        expect(page).to have_no_content('Variable Information')
        expect(page).to have_no_css('.umm-form')
        expect(page).to have_no_css('.variable-form')
      end

      it 'notifies the user that the concept supplied was not found' do
        expect(page).to have_content('Collection not found.') #subject to change
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
      end

      it 'notifies the user that the provider context needs to be changed' do
        expect(page).to have_content('Provider context must be changed.') #subject to change
      end
    end

    context 'when no concept-id is supplied' do
      before do
        click_on 'Create New Record'
      end

      it 'creates a draft with no collection associations' do
        within '.nav-top' do
          click_on 'Done'
        end
        # within '#invalid-draft-modal.eui-modal-content' do
        #   click_on 'Yes'
        # end
        within '.collection-association' do
          click_on 'Collection Association'
        end
        within '#variable-draft-collection-association-table tbody' do
          expect(page).to have_no_content('CIESIN_SEDAC_ANTHROMES_v2_1700')
          expect(page).to have_content('No Collection Association found. A Collection must be selected in order to publish this Variable Draft. Each Variable can only be associated with a single Collection.')
          expect(page).to have_css('tr', count: 1)
        end
      end
    end
  end

  context "when creating a variable draft and associating a collection from the collection's show page" do
    before do
      visit collection_path(collection_concept_id)
      click_on 'Create Associated Variable' #subject to change
    end

    it 'associates the collection upon draft creation' do
      within '.nav-top' do
        click_on 'Done'
      end
      # within '#invalid-draft-modal.eui-modal-content' do
      #   click_on 'Yes'
      # end
      within '.collection-association' do
        click_on 'Collection Association'
      end
      within '#variable-draft-collection-association-table tbody' do
        expect(page).to have_content('CIESIN_SEDAC_ANTHROMES_v2_1700')
        expect(page).to have_css('tr', count: 1)
      end
    end
  end
end
