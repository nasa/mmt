describe 'Saving UVG generated variables as Variable Drafts', js: true do
  before :all do
    @uvg_col_ingest_response, @uvg_col_concept_response = publish_collection_draft
  end

  before do
    login

    visit manage_variables_path

    click_on 'Initiate Variable Generation'
  end

  context 'when submitting an initial request for variable generation' do
    before do
      # search collections
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").fill_in with: @uvg_col_concept_response.body['EntryTitle']
      click_button 'Submit'

      # choose collection
      within '#collection-search-results' do
        choose "selected_collection_#{@uvg_col_ingest_response['concept-id']}"
      end

      # stubbing the naive endpoint until it is live and we can determine if we should use VCR
      response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'full_stubbed_naive_response.json')
      success_response_body = File.read(response_path)
      uvg_generate_response = cmr_success_response(success_response_body)
      allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_generate_stub).and_return(uvg_generate_response)

      click_on 'Generate Variables'
    end

    it 'displays the variable generation results page' do
      expect(page).to have_content('Variable Generation for MMT_2')
      expect(page).to have_content('Naive Variables Generated for collection C1238517344-GES_DISC')

      expect(page).to have_content('Statistics')

      within '.eui-info-box' do
        expect(page).to have_content('Long Names: 0% of 777')
        expect(page).to have_content('Definitions: 100% of 777')
        expect(page).to have_content('Science Keywords: 96% of 777')
      end

      within '.uvg-pagination-header' do
        expect(page).to have_content('Showing Generated Variables 1 - 25 of 777')
      end

      within '#uvg-results-table tbody' do
        expect(page).to have_css('tr', count: 25)
      end
    end

    context 'when choosing to save the generated variables as drafts' do
      context 'when the variable drafts are successfully saved' do
        before do
          click_on 'Save Variable Drafts'
        end

        it 'saves the correct number of drafts with the correct information' do
          expect(page).to have_content('777 variable records generated from collection C1238517344-GES_DISC saved as Variable Drafts!')

          expect(VariableDraft.all.count).to eq(777)

          last_draft = VariableDraft.last
          expect(last_draft.native_id).to include('mmt_variable_')
          expect(last_draft.native_id).to end_with(last_draft.id.to_s)
          expect(last_draft.short_name).to eq(last_draft.draft['Name'])
          expect(last_draft.entry_title).to eq(last_draft.draft['LongName'])
        end
      end

      # TODO: is there a way to create a failure?
      # context 'when the drafts are not successfully saved' do
      # end
    end

    context 'when choosing to Augment with Science Keywords' do
      before do
        click_on 'Select Augmentation'

        # stubbing the naive endpoint until it is live and we can determine if we should use VCR
        response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'full_stubbed_naive_response.json')
        success_response_body = File.read(response_path)
        uvg_augment_keywords_response = cmr_success_response(success_response_body)
        allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_augment_keywords_stub).and_return(uvg_augment_keywords_response)

        choose 'augmentation_type_keywords'

        click_on 'Submit'
      end

      it 'displays the augmented variables' do
        expect(page).to have_content('Statistics')

        within '.eui-info-box' do
          expect(page).to have_content('Long Names: 0% of 777')
          expect(page).to have_content('Definitions: 100% of 777')
          expect(page).to have_content('Science Keywords: 96% of 777')
        end

        expect(page).to have_content('Variable Generation for MMT_2')
        expect(page).to have_content('Variables Augmented with Keywords for collection C1238517344-GES_DISC')

        within '.uvg-pagination-header' do
          expect(page).to have_content('Showing Generated Variables 1 - 25 of 777')
        end

        within '#uvg-results-table tbody' do
          expect(page).to have_css('tr', count: 25)
        end
      end

      context 'when choosing to save the generated variables as drafts' do

        context 'when the variable drafts are successfully saved' do
          before do
            click_on 'Save Variable Drafts'
          end

          it 'saves the appropriate number of drafts to the database' do
            expect(page).to have_content('777 variable records generated from collection C1238517344-GES_DISC saved as Variable Drafts!')

            expect(VariableDraft.all.count).to eq(777)

            last_draft = VariableDraft.last
            expect(last_draft.native_id).to include('mmt_variable_')
            expect(last_draft.native_id).to end_with(last_draft.id.to_s)
            expect(last_draft.short_name).to eq(last_draft.draft['Name'])
            expect(last_draft.entry_title).to eq(last_draft.draft['LongName'])
          end
        end
      end
    end
  end
end
