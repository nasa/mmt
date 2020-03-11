describe 'Deprecating Order Options' do
  context 'when viewing the index page', js: true do
    before do
      login
      VCR.use_cassette('echo_rest/order_options/list_deprecated', record: :none) do
        visit order_options_path
      end
    end

    it "lists available order options with 'Deprecate' links." do
      within '.order-options-table tbody tr:nth-child(1)' do
        expect(page).to have_no_link('Deprecate')
      end
      within '.order-options-table tbody tr:nth-child(2)' do
        expect(page).to have_no_link('Deprecate')
      end
      within '.order-options-table tbody tr:nth-child(3)' do
        expect(page).to have_link('Deprecate')
      end
      within '.order-options-table tbody tr:nth-child(4)' do
        expect(page).to have_no_link('Deprecate')
      end
      within '.order-options-table tbody tr:nth-child(5)' do
        expect(page).to have_no_link('Deprecate')
      end
      within '.order-options-table tbody tr:nth-child(6)' do
        expect(page).to have_no_link('Deprecate')
      end
      within '.order-options-table tbody tr:nth-child(7)' do
        expect(page).to have_link('Deprecate')
      end
      within '.order-options-table tbody tr:nth-child(8)' do
        expect(page).to have_link('Deprecate')
      end
      within '.order-options-table tbody tr:nth-child(9)' do
        expect(page).to have_link('Deprecate')
      end
      within '.order-options-table tbody tr:nth-child(10)' do
        expect(page).to have_link('Deprecate')
      end
    end

    context 'When clicking on a Deprecate link, it asks for confirmation before deprecating.' do
      before do
        within '.order-options-table tbody tr:nth-child(3)' do
          click_on 'Deprecate'
        end
      end

      it 'Asks for confirmation before deprecating' do
        cell_text = find('.order-options-table tbody tr:nth-child(3) td:first-child').text
        expect(page).to have_selector('#deprecate-option-modal-2', visible: true)
        expect(page).to have_content("Are you sure you want to deprecate the order option named '#{cell_text}'?")
        expect(page).to have_link('No')
        expect(page).to have_link('Yes')
      end
    end

    context 'When clicking the No button on the confirmation dialog, it does not deprecate the order option.' do
      before do
        VCR.use_cassette('echo_rest/order_options/list', record: :none) do
          visit order_options_path
        end

        within '.order-options-table tbody tr:nth-child(3)' do
          click_on 'Deprecate'
        end

        within('#deprecate-option-modal-2') do
          click_on 'No'
        end
      end

      it "Hides the dialog after clicking 'No'." do
        expect(page).to have_selector('#deprecate-option-modal-2', visible: false)
      end
    end

    context 'When clicking the Yes button on the confirmation dialog, it deprecates the order option.' do
      before do
        within '.order-options-table tbody tr:last-child' do
          click_on 'Deprecate'
        end

        within('#deprecate-option-modal-24') do
          VCR.use_cassette('echo_rest/order_options/deprecate', record: :none) do
            click_on 'Yes'
          end
        end
      end

      it 'Asks for confirmation before deprecating' do
        expect(page).to have_content('Order Option was successfully deprecated.')
      end
    end
  end
end
