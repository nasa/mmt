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
        expect(page).to have_selector('tbody tr', count: 25)
      end
    end

    it 'displays the pagination information header' do
      expect(page).to have_content('Showing order options 1 - 25 of 28')
    end

    it 'displays the pagination navigation' do
      within '.eui-pagination' do
        # First, 1, 2, Next, Last
        expect(page).to have_selector('li', count: 5)
      end
    end

    it 'shows the correct active page' do
      expect(page).to have_css('.active-page', text: '1')
    end

    it 'sorts the list correctly' do
      # First row
      within '.order-options-table tbody tr:nth-child(1) td:nth-child(1)' do
        expect(page).to have_content('1001')
      end

      # Last row
      within '.order-options-table tbody tr:last-child td:nth-child(1)' do
        expect(page).to have_content('Opt A05')
      end
    end

    context 'when clicking through to the second page' do
      before do
        VCR.use_cassette('echo_soap/data_management_service/option_definitions/list', record: :none) do
          within '.eui-pagination li:nth-child(3)' do
            click_link '2'
          end
        end
      end

      it 'displays the pagination information for page two' do
        expect(page).to have_content('Showing order options 26 - 28 of 28')
      end

      it 'lists all the available order options' do
        within '.order-options-table' do
          expect(page).to have_selector('tbody tr', count: 3)
        end
      end
      it 'sorts the list correctly' do
        # First row
        within '.order-options-table tbody tr:nth-child(1) td:nth-child(1)' do
          expect(page).to have_content('Opt A07')
        end

        # Last row
        within '.order-options-table tbody tr:last-child td:nth-child(1)' do
          expect(page).to have_content('Test Order Option ABC-1')
        end
      end
    end
  end
end
