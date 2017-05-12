require 'rails_helper'

describe 'Creating a Data Quality Summary Assignment', js: true do
  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login

    User.first.update(provider_id: 'MMT_2')
  end

  context 'when viewing the new data quality summary assignment form' do
    before do
      VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/create', record: :none) do
        visit new_data_quality_summary_assignments_path
      end
    end

    it 'displays the data quality summary assignment form' do
      expect(page).to have_content('New MMT_2 Data Quality Summary Assignments')

      wait_for_ajax
      
      # Check that all 6 results appear on the page
      expect(page).to have_selector('#catalog_item_guid_fromList option', count: 6)

      # Check for 2 specific results
      expect(page).to have_css('#catalog_item_guid_fromList option[value="C1200189943-MMT_2"]')
      expect(page).to have_css('#catalog_item_guid_fromList option[value="C1200189951-MMT_2"]')
    end

    context 'when submitting the data quality summary assignment form' do
      context 'with invalid values', js: true do
        before do
          within '#data-quality-summary-assignments-form' do
            click_on 'Submit'
          end
        end

        it 'displays validation errors within the form' do
          expect(page).to have_content('Data Quality Summary is required.')
          expect(page).to have_content('You must select at least 1 collection.')
        end
      end

      context 'with valid values' do
        before do
          select 'DQS #1', from: 'definition_guid'

          within '#catalog_item_guid_fromList' do
            # Mark's Test
            find('option[value="C1200060160-MMT_2"]').select_option

            # Matthew's Test
            find('option[value="C1200019403-MMT_2"]').select_option
          end

          within '.button-container' do
            find('.add_button').click
          end

          VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/created', record: :none) do
            within '#data-quality-summary-assignments-form' do
              click_on 'Submit'
            end
          end
        end

        it 'creates the assignment and displays a confirmation message' do
          expect(page).to have_content('2 data quality summary assignments created successfully.')
        end
      end
    end
  end
end
