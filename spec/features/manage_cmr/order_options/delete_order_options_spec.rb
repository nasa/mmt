describe 'Deleting Order Options' do
  context 'when viewing the index page' do
    before do
      login

      VCR.use_cassette('echo_rest/order_options/list', record: :none) do
        visit order_options_path
      end
    end

    it "lists available order options with 'Delete' links." do
      (1..25).each do |i|
        within ".order-options-table tbody tr:nth-child(#{i})" do
          expect(page).to have_link 'Delete'
        end
      end
    end

    context 'When clicking on a Delete link, it asks for confirmation before deleting.' do
      before do
        VCR.use_cassette('echo_rest/order_options/list', record: :none) do
          visit order_options_path
        end

        within '.order-options-table tbody tr:last-child' do
          click_on 'Delete'
        end
      end

      it 'Asks for confirmation before deleting' do
        cell_text = find('.order-options-table tbody tr:first-child td:first-child').text

        expect(page).to have_selector('#delete-option-modal-0', visible: true)

        expect(page).to have_content("Are you sure you want to delete the order option named '#{cell_text}'?")
        expect(page).to have_link('No')
        expect(page).to have_link('Yes')
      end
    end

    context 'When clicking the No button on the confirmation dialog, it does not delete the order option.' do
      before do
        VCR.use_cassette('echo_rest/order_options/list', record: :none) do
          visit order_options_path
        end

        within '.order-options-table tbody tr:last-child' do
          click_on 'Delete'
        end

        within('#delete-option-modal-0') do
          click_on 'No'
        end
      end

      it 'Asks for confirmation before deleting' do
        expect(page).to have_selector('#delete-option-modal-0', visible: false)
      end
    end

    context 'When clicking the Yes button on the confirmation dialog, it deletes the order option.' do
      before do
        VCR.use_cassette('echo_rest/order_options/list2', record: :none) do
          visit order_options_path
        end

        within '.order-options-table tbody tr:first-child' do
          click_on 'Delete'
        end

        within('#delete-option-modal-0') do
          VCR.use_cassette('echo_rest/order_options/delete', record: :none) do
            click_on 'Yes'
          end
        end
      end

      it 'Asks for confirmation before deleting' do
        expect(page).to have_content('Order Option was successfully deleted.')
      end
    end

    context 'When displays an error message if an order option cannot be deleted' do
      let(:cell_text) { '' }

      before do
        VCR.use_cassette('echo_rest/order_options/list', record: :none) do
          visit order_options_path
        end

        within '.order-options-table tbody tr:first-child' do
          click_on 'Delete'
        end

        within('#delete-option-modal-0') do
          VCR.use_cassette('echo_rest/order_options/delete-fail', record: :none) do
            click_on 'Yes'
          end
        end

        cell_text = find('.order-options-table tbody tr:first-child td:first-child').text
      end

      it 'Displays an error message and lists the' do
        expect(page).to have_content('Cannot remove the option definition because there are catalog items assigned to it. Assigned catalog item guids [C1200056652-MMT_2,C1200060160-MMT_2] guid: [C7EB886C-5790-76E0-0E51-D2CFD6985AC6]')
        expect(page).to have_content(cell_text)
      end
    end
  end
end
