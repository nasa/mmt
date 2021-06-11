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
      expect(page).to have_content('Showing Order Options 1 - 25 of 77')
    end

    it 'displays the pagination navigation' do
      within '.eui-pagination' do
        # First, 1, 2, Next, Last
        expect(page).to have_selector('li', count: 7)
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
        expect(page).to have_content("Franc's Coffeescript Feat")
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
        expect(page).to have_content('Showing Order Options 26 - 50 of 77')
      end

      it 'lists all the available order options' do
        within '.order-options-table' do
          expect(page).to have_selector('tbody tr', count: 25)
        end
      end
      it 'sorts the list correctly' do
        # First row
        within '.order-options-table tbody tr:nth-child(1) td:nth-child(1)' do
          expect(page).to have_content("Franc's Coffeescript Featur")
        end

        # Last row
        within '.order-options-table tbody tr:last-child td:nth-child(1)' do
          expect(page).to have_content('James-1000')
        end
      end
    end
  end

  context 'when viewing the index page with a large xml response that breaks REXML' do
    before do
      login

      VCR.use_cassette('echo_soap/data_management_service/option_definitions/big_list', record: :none) do
        visit order_options_path
      end
    end

    it 'lists all the available order options' do
      within '.order-options-table' do
        expect(page).to have_selector('tbody tr', count: 25)
      end
    end
  end

  context 'when viewing the index page and there is only one order option' do
    before do
      login

      VCR.use_cassette('echo_soap/data_management_service/option_definitions/single_list', record: :none) do
        visit order_options_path
      end
    end

    it 'lists the order option' do
      expect(page).to have_selector('tbody tr', count: 25)
      expect(page).to have_no_content('No EDF_DEV07 Order Options found.') # provider for the recording is EDF_DEV07
    end
  end
end
