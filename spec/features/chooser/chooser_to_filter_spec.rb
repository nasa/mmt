describe 'Chooser To Filter', js: true do
  before do
    collections_response = cmr_success_response(File.read('spec/fixtures/cmr_search.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login
  end

  context 'when viewing the chooser on the DQS Assignments page' do
    before do
      VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/create', record: :none) do
        visit new_data_quality_summary_assignments_path
      end

      within '#catalog_item_guid_fromList' do
        # ID_1 | Mark's Test
        find('option[value="C1200060160-MMT_2"]').select_option

        # testing 03_002 | Test test title 03
        find('option[value="C1200189951-MMT_2"]').select_option

        # testing 02_01 | My testing title 02
        find('option[value="C1200189943-MMT_2"]').select_option
      end

      within '.button-container' do
        find('.add_button').click
      end
    end

    it 'moves the items to the TO list' do
      within '#catalog_item_guid_toList' do
        expect(page).to have_css('option', count: 3)
        expect(page).to have_css('option.icon-s3', count: 1, text: '🟠 ID_1 | Mark\'s Test')
      end

      # checks the hover-over values
      within '#ui-id-1' do
        expect(page).to have_content('ID_1 | Mark\'s Test')
        expect(page).to have_content('S3 Prefix: bucket1')
        expect(page).to have_content('S3 Prefix: bucket2')
        expect(page).to have_content('S3 Prefix: bucket3')
      end

      within '#ui-id-2' do
         expect(page).to have_content('testing 03_002 | Test test title 03')
      end

      within '#ui-id-3' do
        expect(page).to have_content('testing 02_01 | My testing title 02')
      end
    end

    it 'displays the correct number of collections in the TO list' do
      within '.to-container' do
        expect(page).to have_content('Selected Collections (3)')
        expect(page).to have_content('Showing 3 of 3 items')
      end
    end

    context 'when filtering the right hand side of the chooser' do
      before do
        within '.to-container' do
          find('input').set('02')
        end
      end

      it 'hides values that do not match the search text' do
        within '#catalog_item_guid_toList' do
          # Selenium is picking up the '.is-hidden' element(s) for some reason, so we need to specify not having the class
          expect(page).to have_css('option:not(.is-hidden)', count: 2)
          expect(page).to have_css('option.icon-s3', count: 1, text: '🟠 ID_1 | Mark\'s Test')
        end

        # checks the hover-over values
        within '#ui-id-1' do
          expect(page).to have_content('ID_1 | Mark\'s Test')
          expect(page).to have_content('S3 Prefix: bucket1')
          expect(page).to have_content('S3 Prefix: bucket2')
          expect(page).to have_content('S3 Prefix: bucket3')
        end

        within '#ui-id-2' do
           expect(page).to have_content('testing 03_002 | Test test title 03')
        end

        within '#ui-id-3' do
          expect(page).to have_content('testing 02_01 | My testing title 02')
        end
      end

      it 'displays the correct number of collections in the TO list' do
        within '.to-container' do
          expect(page).to have_content('Selected Collections (3)')
          expect(page).to have_content('Showing 2 of 3 items')
        end
      end

      context 'when adding a collection that matches the filter' do
        before do
          within '#catalog_item_guid_fromList' do
            # New Testy Test_02 | Testy long entry title
            find('option[value="C1200190013-MMT_2"]').select_option
          end

          within '.button-container' do
            find('.add_button').click
          end
        end

        it 'displays the new collection in the TO list' do
          within '#catalog_item_guid_toList' do
            # Selenium is picking up the '.is-hidden' element(s) for some reason, so we need to specify not having the class
            expect(page).to have_css('option:not(.is-hidden)', count: 3)
            expect(page).to have_css('option.icon-s3', count: 1, text: '🟠 ID_1 | Mark\'s Test')
          end

          # checks the hover-over values
          within '#ui-id-1' do
            expect(page).to have_content('ID_1 | Mark\'s Test')
            expect(page).to have_content('S3 Prefix: bucket1')
            expect(page).to have_content('S3 Prefix: bucket2')
            expect(page).to have_content('S3 Prefix: bucket3')
          end

          within '#ui-id-2' do
             expect(page).to have_content('testing 03_002 | Test test title 03')
          end

          within '#ui-id-3' do
            expect(page).to have_content('testing 02_01 | My testing title 02')
          end
        end

        it 'displays the correct number of collections in the TO list' do
          within '.to-container' do
            expect(page).to have_content('Selected Collections (4)')
            expect(page).to have_content('Showing 3 of 4 items')
          end
        end
      end

      context 'when adding a collection that does not match the filter' do
        before do
          within '#catalog_item_guid_fromList' do
            # lorem_223 | ipsum
            find('option[value="C1200056652-MMT_2"]').select_option
          end

          within '.button-container' do
            find('.add_button').click
          end
        end

        it 'does not display the new collection in the TO list' do
          within '#catalog_item_guid_toList' do
            # Selenium is picking up the '.is-hidden' element(s) for some reason, so we need to specify not having the class
            expect(page).to have_css('option:not(.is-hidden)', count: 2)
            expect(page).to have_css('option.icon-s3', count: 1, text: '🟠 ID_1 | Mark\'s Test')
          end

          # checks the hover-over values
          within '#ui-id-1' do
            expect(page).to have_content('ID_1 | Mark\'s Test')
            expect(page).to have_content('S3 Prefix: bucket1')
            expect(page).to have_content('S3 Prefix: bucket2')
            expect(page).to have_content('S3 Prefix: bucket3')
          end

          within '#ui-id-2' do
             expect(page).to have_content('testing 03_002 | Test test title 03')
          end

          within '#ui-id-3' do
            expect(page).to have_content('testing 02_01 | My testing title 02')
          end
        end

        it 'displays the correct number of collections in the TO list' do
          within '.to-container' do
            expect(page).to have_content('Selected Collections (4)')
            expect(page).to have_content('Showing 2 of 4 items')
          end
        end
      end
    end
  end
end
