describe 'Naive Variable Generation' do
  before :all do
    @naive_uvg_col_ingest_response, @naive_uvg_col_concept_response = publish_collection_draft
  end

  before do
    login

    visit manage_variables_path

    click_on 'Initiate Variable Generation'
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
          choose "selected_collection_#{@naive_uvg_col_ingest_response['concept-id']}"
        end
      end

      context 'when there are no variables generated' do
        before do
          # stubbing the naive endpoint until it is live and we can determine if we should use VCR
          response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'zero_stubbed_naive_response.json')
          success_response_body = File.read(response_path)
          uvg_generate_response = cmr_success_response(success_response_body)
          allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_generate).and_return(uvg_generate_response)

          click_on 'Generate Variables'
        end

        it 'displays the Variable Generation show (results) page' do
          expect(page).to have_content('Variable Generation for MMT_2')
          expect(page).to have_content('Naive Variables Generated for collection C1238517344-GES_DISC')
        end

        it 'displays statistics for the generated Variables' do
          expect(page).to have_content('Statistics')

          within '.eui-info-box' do
            expect(page).to have_content('Long Names found: 0.0% of 0')
            expect(page).to have_content('Definitions found: 0.0% of 0')
          end
        end

        it 'indicates no variables were generated' do
          within 'table#uvg-results-table' do
            expect(page).to have_css('tr', count: 1, text: 'No variables generated.')
          end
        end

        it 'does not display pagination information or links' do
          expect(page).to have_no_css('.uvg-pagination-header')
          expect(page).to have_no_css('.eui-pagination')
        end
      end

      context 'when there are a handful of variables generated' do
        before do
          # stubbing the naive endpoint until it is live and we can determine if we should use VCR
          response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'small_stubbed_naive_response.json')
          success_response_body = File.read(response_path)
          uvg_generate_response = cmr_success_response(success_response_body)
          allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_generate).and_return(uvg_generate_response)

          click_on 'Generate Variables'
        end

        it 'displays the Variable Generation show (results) page' do
          expect(page).to have_content('Variable Generation for MMT_2')
          expect(page).to have_content('Naive Variables Generated for collection C1238517344-GES_DISC')
        end

        it 'displays statistics for the generated Variables' do
          expect(page).to have_content('Statistics')

          within '.eui-info-box' do
            expect(page).to have_content('Long Names found: 12.5% of 16')
            expect(page).to have_content('Definitions found: 56.25% of 16')
          end
        end

        it 'generates the variables and displays them on the page' do
          expect(page).to have_content('Showing all 16 Generated Variables')

          within '#uvg-results-table tbody' do
            expect(page).to have_css('tr', count: 16)
          end
        end

        it 'does not display pagination links' do
          expect(page).to have_no_css('ul.eui-pagination')
        end

        context 'when clicking on a variable name' do
          let(:modal_variable_json) { File.read(File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'modal_variable_json.json')) }

          before do
            within '#uvg-results-table tbody' do
              click_on 'TotalCounts_A'
            end
          end

          it 'shows a modal with the variable json' do
            within '#variable-preview-modal' do
              expect(page).to have_content('Generated Variable Record: TotalCounts_A')
              expect(page).to have_content(modal_variable_json)
            end
          end
        end
      end

      context 'when there are a large number of variables generated' do
        before do
          # stubbing the naive endpoint until it is live and we can determine if we should use VCR
          response_path = File.join(Rails.root, 'spec', 'fixtures', 'variable_generation', 'full_stubbed_naive_response.json')
          success_response_body = File.read(response_path)
          uvg_generate_response = cmr_success_response(success_response_body)
          allow_any_instance_of(Cmr::UvgClient).to receive(:uvg_generate).and_return(uvg_generate_response)

          click_on 'Generate Variables'
        end

        it 'displays the Variable Generation show (results) page' do
          expect(page).to have_content('Variable Generation for MMT_2')
          expect(page).to have_content('Naive Variables Generated for collection C1238517344-GES_DISC')
        end

        it 'displays statistics for the generated Variables' do
          expect(page).to have_content('Statistics')

          within '.eui-info-box' do
            expect(page).to have_content('Long Names found: 0.0% of 777')
            expect(page).to have_content('Definitions found: 100.0% of 777')
          end
        end

        it 'generates the variables and displays them on the page' do
          within '#uvg-results-table tbody' do
            expect(page).to have_css('tr', count: 25)
          end
        end

        it 'displays pagination information and links' do
          within '.uvg-pagination-header' do
            expect(page).to have_content('Showing Generated Variables 1 - 25 of 777')
          end

          within '.eui-pagination' do
            expect(page).to have_no_css('a', text: 'Previous')
            expect(page).to have_css('a', text: '1')
            expect(page).to have_css('.active-page a', text: '1')
            expect(page).to have_css('a', text: '2')
            expect(page).to have_css('a', text: '3')
            expect(page).to have_css('a', text: '4')
            expect(page).to have_css('a', text: '5')
            expect(page).to have_css('a', text: '32')
            expect(page).to have_css('a', text: 'Next')
          end
        end

        context 'when clicking on the Next link' do
          before do
            within '#uvg-pagination' do
              click_on 'Next'
            end
          end

          it 'displays the correct page and information' do
            within '.uvg-pagination-header' do
              expect(page).to have_content('Showing Generated Variables 26 - 50 of 777')
            end

            within '#uvg-results-table tbody' do
              expect(page).to have_css('tr', count: 25)
            end

            within '.eui-pagination' do
              expect(page).to have_css('.active-page a', text: '2')
            end
          end
        end

        context 'when clicking on the last page' do
          before do
            within '#uvg-pagination' do
              click_on '32'
            end
          end

          it 'displays the correct page and information' do
            within '.uvg-pagination-header' do
              expect(page).to have_content('Showing Generated Variables 776 - 777 of 777')
            end

            within '#uvg-results-table tbody' do
              expect(page).to have_css('tr', count: 2)
            end

            within '.eui-pagination' do
              expect(page).to have_css('a', text: 'Previous')
              expect(page).to have_css('a', text: '1')
              expect(page).to have_css('a', text: '28')
              expect(page).to have_css('a', text: '29')
              expect(page).to have_css('a', text: '30')
              expect(page).to have_css('a', text: '31')
              expect(page).to have_css('.active-page a', text: '32')
              expect(page).to have_no_css('a', text: 'Next')
            end
          end

          context 'when then clicking on the previous page' do
            before do
              within '#uvg-pagination' do
                click_on 'Previous'
              end
            end

            it 'displays the correct page and information' do
              within '.uvg-pagination-header' do
                expect(page).to have_content('Showing Generated Variables 751 - 775 of 777')
              end

              within '#uvg-results-table tbody' do
                expect(page).to have_css('tr', count: 25)
              end

              within '.eui-pagination' do
                expect(page).to have_css('.active-page a', text: '31')
              end
            end
          end
        end
      end
    end
  end
end
