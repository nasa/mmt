describe 'UVG Augmentation requests', js: true do
  before :all do
    @naive_uvg_col_ingest_response, @naive_uvg_col_concept_response = publish_collection_draft
  end

  context 'when submitting a UVG request that will require augmentation' do
    before do
      login

      visit manage_variables_path

      click_on 'Initiate Variable Generation'
    end

    context 'when submitting a request for naive generation' do
      before do
        # search collections
        select 'Entry Title', from: 'Search Field'
        find(:css, "input[id$='query_text']").fill_in with: @naive_uvg_col_concept_response.body['EntryTitle']
        click_button 'Submit'

        # choose collection
        within '#collection-search-results' do
          choose "selected_collection_#{@naive_uvg_col_ingest_response['concept-id']}"
        end

        # stubbing the naive endpoint until it is live and we can determine if we should use VCR
        response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'full_stubbed_naive_response.json')
        success_response_body = File.read(response_path)
        uvg_generate_response = cmr_success_response(success_response_body)
        allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_generate).and_return(uvg_generate_response)

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

      context 'when choosing to Select an Augmentation' do
        before do
          click_on 'Select Augmentation'
        end

        it 'displays the augmentation selection page' do
          expect(page).to have_content('Augmentation')

          expect(page).to have_css("input[type='radio']:disabled", count: 3)
          expect(page).to have_css('#augmentation_type_keywords:not([disabled])')
        end

        context 'when submitting to Augment with Science Keywords' do
          before do
            # stubbing the naive endpoint until it is live and we can determine if we should use VCR
            response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'full_stubbed_naive_response.json')
            success_response_body = File.read(response_path)
            uvg_augment_keywords_response = cmr_success_response(success_response_body)
            allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_augment_keywords_stub).and_return(uvg_augment_keywords_response)

            # select augment with science keywords
            choose 'augmentation_type_keywords'

            click_on 'Submit'
          end

          it 'displays the new statistics' do
            expect(page).to have_content('Statistics')

            within '.eui-info-box' do
              expect(page).to have_content('Long Names: 0% of 777')
              expect(page).to have_content('Definitions: 100% of 777')
              expect(page).to have_content('Science Keywords: 96% of 777')
            end
          end

          it 'displays the augmented variables' do
            expect(page).to have_content('Variable Generation for MMT_2')
            expect(page).to have_content('Variables Augmented with Keywords for collection C1238517344-GES_DISC')

            within '.uvg-pagination-header' do
              expect(page).to have_content('Showing Generated Variables 1 - 25 of 777')
            end

            within '#uvg-results-table tbody' do
              expect(page).to have_css('tr', count: 25)
            end
          end
        end
      end
    end
  end
end
