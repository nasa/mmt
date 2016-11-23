require 'rails_helper'

describe 'Listing Order Options' do
  context 'when viewing the index page' do
    before do
      login

      VCR.use_cassette('echo_soap/data_management_service/option_definitions/list', record: :none) do
        visit order_options_path
      end
    end

    it 'lists all the available order options' do
      within '.order-options-table' do
        expect(page).to have_selector('tbody tr', count: 28)
      end
    end

    it 'sorts the list correctly' do
      # First row
      within '.order-options-table tbody tr:nth-child(1) td:nth-child(1)' do
        expect(page).to have_content('1001')
      end

      # Last row
      within '.order-options-table tbody tr:last-child td:nth-child(1)' do
        expect(page).to have_content('Test Order Option ABC-1')
      end
    end
  end
end
