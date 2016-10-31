require 'rails_helper'

describe 'Creating a Data Quality Summary Assignment' do
  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)

    login

    User.first.update(provider_id: 'MMT_2')

    visit data_quality_summary_assignments_path
  end

  context 'when submitting the data quality summary assignment form' do
    before do
      VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/create', record: :none) do
        click_on 'Create New Assignments'
      end
    end

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

        # Mark's Test
        check 'catalog_item_guid_C1200060160-MMT_2'

        # Matthew's Test
        check 'catalog_item_guid_C1200019403-MMT_2'

        VCR.use_cassette('echo_soap/data_management_service/data_quality_summary_assignments/created', record: :none) do
          within '#data-quality-summary-assignments-form' do
            click_on 'Submit'
          end
        end
      end

      it 'creates the assignment and displays a confirmation message' do
        expect(page).to have_content('2 data quality summary assignments created successfully, 0 data quality summary assignments failed to save.')
      end
    end
  end
end