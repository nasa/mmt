describe 'Close Order', js: true do
  before do
    login
  end
  context 'when clicking the Close Order button on the order page' do
    before do
      VCR.use_cassette("orders/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        visit order_path('order_guid')
        click_on 'Close Order'
      end
      fill_in 'Status Message', with: 'Provider message'
      click_on 'Close Order'
    end
    it 'displays a confirmation dialog' do
      expect(page).to have_content('Are you sure you want to close the order?')
    end

    context 'when clicking yes to confirm the closing of the order' do
      before do
        allow_any_instance_of(ProviderOrderPolicy).to receive(:resubmit?).and_return(true)
        VCR.use_cassette("orders/#{File.basename(__FILE__, '.rb')}_confirm_vcr", record: :none, match_requests_on: [:method, :uri, :body]) do
          click_on 'Yes'
        end
      end

      it 'displays order information' do
        expect(page).to have_content('Order GUID: order_guid')
        expect(page).to have_content('State: CLOSED')
        expect(page).to have_content('Created: 2022-12-16T16:22:25.344Z')
        expect(page).to have_content('Submitted: 2023-02-07T16:06:55.320Z')
        expect(page).to have_content('Updated: 2023-02-07T17:52:42.579Z')
        expect(page).to have_content('Owner: Test UserOne test_user_1')
        expect(page).to have_content('Notification Level: INFO')
        expect(page).to have_content('Affiliation: GOVERNMENT')
        expect(page).to have_content('User Region: USA')
        expect(page).to have_content('Client Identity: cmr-test-user')

        expect(page).to have_link('Resubmit Order')

        within '#catalog-items-table' do
          expect(page).to have_content('G1200441869-CMRORDER')
          expect(page).to have_content('CMRORDER-Test-Granule1')
          expect(page).to have_content('cmrorder-test-granule1')
          expect(page).to have_content('G1200441870-CMRORDER')
          expect(page).to have_content('CMRORDER-Test-Granule2')
          expect(page).to have_content('cmrorder-test-granule2')
        end
      end
    end
  end
end
