describe 'Naive Variable Generation', reset_provider: true do
  before :all do
    @naive_uvg_col_ingest_response, @naive_uvg_col_concept_response = publish_collection_draft
  end

  before do
    login

    visit new_variable_generation_processes_search_path
  end

  context 'when submitting a request for naive variable generation' do
    before do
      # search collections
      select 'Entry Title', from: 'Search Field'
      find(:css, "input[id$='query_text']").fill_in with: @naive_uvg_col_concept_response.body['EntryTitle']
      click_button 'Submit'
    end

    it 'displays the collection in the table with an appropriate radio button' do
      within '#collection-search-results' do
        expect(page).to have_css("input[type='radio']#selected_collection_#{@naive_uvg_col_ingest_response['concept-id']}")
        expect(page).to have_content(@naive_uvg_col_concept_response.body['EntryTitle'])
      end
    end

    context 'when choosing a collection and submitting to generate variables', js: true do
      before do
        within '#collection-search-results' do
          puts "concept_id: #{@naive_uvg_col_ingest_response['concept-id']}"
          puts "trying to choose: #selected_collection_#{@naive_uvg_col_ingest_response['concept-id']}"
          choose "selected_collection_#{@naive_uvg_col_ingest_response['concept-id']}"
        end

        # stubbing the naive endpoint until it is live and we can determine
        # if we should use VCR
        response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'small_stubbed_naive_response.json')
        success_response_body = File.read(response_path)
        uvg_generate_response = cmr_success_response(success_response_body)
        allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_generate).and_return(uvg_generate_response)

        click_on 'Generate Variables'
      end

      it 'generates the variables and displays them on the page' do
        expect(page).to have_content('UMM Variable Generation')
        expect(page).to have_content('Naive Variables')
      end
    end
  end
end
