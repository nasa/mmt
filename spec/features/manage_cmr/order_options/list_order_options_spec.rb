describe 'Listing Order Options', js: true do
  context 'when viewing the index page' do
    before do
      login

      VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        visit order_options_path
      end
    end

    it 'lists all the available order options' do
      within '.order-options-table' do
        expect(page).to have_selector('tbody tr', count: 25)
      end
    end

    it 'displays the pagination information header' do
      expect(page).to have_content('Showing Order Options 1 - 25 of 33')
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
        expect(page).to have_content('Test order option 001')
      end

      # Last row
      within '.order-options-table tbody tr:last-child td:nth-child(1)' do
        expect(page).to have_content("Test_order_option_019")
      end
    end

    context 'when clicking through to the second page' do
      before do
        VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          within '.eui-pagination li:nth-child(3)' do
            click_link '2'
          end
        end
      end

      it 'displays the pagination information for page two' do
        expect(page).to have_content('Showing Order Options 26 - 33 of 33')
      end

      it 'lists all the available order options' do
        within '.order-options-table' do
          expect(page).to have_selector('tbody tr', count: 8)
        end
      end
      it 'sorts the list correctly' do
        # First row
        within '.order-options-table tbody tr:nth-child(1) td:nth-child(1)' do
          expect(page).to have_content("Test_order_option_020")
        end

        # Last row
        within '.order-options-table tbody tr:last-child td:nth-child(1)' do
          expect(page).to have_content('Test_order_option_033')
        end
      end
    end
  end

  context 'when viewing the index page and there is only one order option' do
    before do
      login

      VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_one_order_option_vcr", record: :none) do
        visit order_options_path
      end
    end

    it 'lists the order option' do
      expect(page).to have_selector('tbody tr', count: 1)
      expect(page).to have_no_content('No MMT_2 Order Options found.')
    end
  end

  context 'when viewing the index page and there is no order option' do
    before do
      login

      VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_no_order_option_vcr", record: :none) do
        visit order_options_path
      end
    end

    it 'lists the order option' do
      expect(page).to have_selector('tbody tr', count: 1)
      expect(page).to have_content('No MMT_2 Order Options found.')
    end
  end
end
