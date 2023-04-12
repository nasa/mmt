describe 'Deleting Order Options', js: true do
  context 'when viewing the index page' do
    before do
      login

      VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
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
        VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          visit order_options_path
        end

        within '.order-options-table tbody tr:last-child' do
          click_on 'Delete'
        end
      end

      it 'Asks for confirmation before deleting' do
        expect(page).to have_selector('#delete-option-modal-24', visible: true)

        expect(page).to have_content("Are you sure you want to delete the order option named 'Test_order_option_019'?")
        expect(page).to have_link('No')
        expect(page).to have_link('Yes')
      end
    end

    context 'When clicking the No button on the confirmation dialog, it does not delete the order option.' do
      before do
        VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          visit order_options_path
        end

        within '.order-options-table tbody tr:last-child' do
          click_on 'Delete'
        end

        within('#delete-option-modal-24') do
          click_on 'No'
        end
      end

      it 'Asks for confirmation before deleting' do
        expect(page).to have_selector('#delete-option-modal-24', visible: false)
      end
    end

    context 'When clicking the Yes button on the confirmation dialog, it deletes the order option.' do
      before do
        VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          visit order_options_path
        end

        within '.order-options-table tbody tr:first-child' do
          click_on 'Delete'
        end

        within('#delete-option-modal-0') do
          VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_delete_ok_vcr", record: :none) do
            click_on 'Yes'
          end
        end
      end

      it 'Asks for confirmation before deleting' do
        expect(page).to have_content('Order Option was successfully deleted.')
      end
    end
  end
end
