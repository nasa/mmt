require 'rails_helper'

describe 'Chooser Disable Selected Options', js: true do
  before do
    collections_response = cmr_success_response(File.read('spec/fixtures/cmr_search.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login
  end

  context 'when selecting items from the left hand side of the chooser' do
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

    it 'disables the selected items in the from list' do
      within '#catalog_item_guid_fromList' do
        expect(page).to have_css('option.icon-s3[value="C1200060160-MMT_2"]:disabled')
        expect(page).to have_css('option[value="C1200189951-MMT_2"]:disabled')
        expect(page).to have_css('option[value="C1200189943-MMT_2"]:disabled')
      end

      # checks the hover-over values
      expect(page).to have_css('.ui-tooltip-content', text: 'ID_1 | Mark\'s Test<br><b>S3 Prefix:</b> bucket1<br><b>S3 Prefix:</b> bucket2<br><b>S3 Prefix:</b> bucket3', count: 1)
      expect(page).to have_css('.ui-tooltip-content', text: 'testing 03_002 | Test test title 03', count: 1)
      expect(page).to have_css('.ui-tooltip-content', text: 'testing 02_01 | My testing title 02', count: 1)
    end

    context 'when removing those values from the right hand side of the chooser individually' do
      before do
        within '#catalog_item_guid_toList' do
          # ID_1 | Mark's Test
          find('option[value="C1200060160-MMT_2"]').select_option

          # testing 03_002 | Test test title 03
          find('option[value="C1200189951-MMT_2"]').select_option

          # testing 02_01 | My testing title 02
          find('option[value="C1200189943-MMT_2"]').select_option
        end

        within '.button-container' do
          find('.remove_button').click
        end
      end

      it 'enables the items on the left hand side' do
        within '#catalog_item_guid_fromList' do
          expect(page).to have_css('option.icon-s3[value="C1200060160-MMT_2"]:enabled')
          expect(page).to have_css('option[value="C1200189951-MMT_2"]:enabled')
          expect(page).to have_css('option[value="C1200189943-MMT_2"]:enabled')
        end

        # checks the hover-over values
        expect(page).to have_css('.ui-tooltip-content', text: 'ID_1 | Mark\'s Test<br><b>S3 Prefix:</b> bucket1<br><b>S3 Prefix:</b> bucket2<br><b>S3 Prefix:</b> bucket3', count: 1)
        expect(page).to have_css('.ui-tooltip-content', text: 'testing 03_002 | Test test title 03', count: 1)
        expect(page).to have_css('.ui-tooltip-content', text: 'testing 02_01 | My testing title 02', count: 1)
      end
    end

    context 'when removing those values from the right hand side of the chooser with the remove all button' do
      before do
        within '.button-container' do
          find('.remove_all_button').click
        end
      end

      it 'enables the items on the left hand side' do
        within '#catalog_item_guid_fromList' do
          expect(page).to have_css('option[value="C1200060160-MMT_2"].icon-s3:enabled')
          expect(page).to have_css('option[value="C1200189951-MMT_2"]:enabled')
          expect(page).to have_css('option[value="C1200189943-MMT_2"]:enabled')
        end

        # checks the hover-over values
        expect(page).to have_css('.ui-tooltip-content', text: 'ID_1 | Mark\'s Test<br><b>S3 Prefix:</b> bucket1<br><b>S3 Prefix:</b> bucket2<br><b>S3 Prefix:</b> bucket3', count: 1)
        expect(page).to have_css('.ui-tooltip-content', text: 'testing 03_002 | Test test title 03', count: 1)
        expect(page).to have_css('.ui-tooltip-content', text: 'testing 02_01 | My testing title 02', count: 1)
      end
    end
  end
end
