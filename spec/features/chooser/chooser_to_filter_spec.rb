require 'rails_helper'

describe 'Chooser To Filter', js: true do
  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login
  end

  context 'when viewing the chooser on the DQS Assignments page' do
    before do
      VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/create', record: :none) do
        visit new_data_quality_summary_assignments_path
      end

      within '#catalog_item_guid_fromList' do
        # Mark's Test
        find('option[value="C1200060160-MMT_2"]').select_option

        # Matthew's Test
        find('option[value="C1200019403-MMT_2"]').select_option
      end

      within '.button-container' do
        find('.add_button').click
      end
    end

    it 'moves two values to the TO list' do
      within '#catalog_item_guid_toList' do
        expect(page).to have_css('option', count: 2)
      end
    end

    it 'displays the correct number of collections in the TO list' do
      within '.to-container' do
        expect(page).to have_content('Selected Collections (2)')
        expect(page).to have_content('Showing 2 of 2 items')
      end
    end

    context 'when filtering the right hand side of the chooser' do
      before do
        within '.to-container' do
          find('input').set('Matthew')
        end
      end

      it 'hides values that do not match the search text' do
        within '#catalog_item_guid_toList' do
          expect(page).to have_css('option', count: 1)
        end
      end

      it 'displays the correct number of collections in the TO list' do
        within '.to-container' do
          expect(page).to have_content('Selected Collections (2)')
          expect(page).to have_content('Showing 1 of 2 items')
        end
      end
    end
  end
end
