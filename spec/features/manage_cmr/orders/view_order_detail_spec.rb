describe 'Viewing Order Detail', js: true do
  before do
    login
    allow_any_instance_of(ProviderOrderPolicy).to receive(:resubmit?).and_return(true)
  end
  context 'when viewing detail of a closed order' do
    before do
      VCR.use_cassette("orders/#{File.basename(__FILE__, '.rb')}_closed_order_vcr", record: :none) do
        visit order_path('order_guid')
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
  context 'when viewing detail of a closeable order' do
    before do
      VCR.use_cassette("orders/#{File.basename(__FILE__, '.rb')}_non_resubmit_order_vcr", record: :none) do
        visit order_path('order_guid')
      end
    end
    it 'displays order information' do
      expect(page).to have_content('Order GUID: order_guid')
      expect(page).to have_content('State: SUBMITTING')
      expect(page).to have_content('Created: 2022-12-16T16:22:25.344Z')
      expect(page).to have_content('Submitted: 2023-02-07T16:06:55.320Z')
      expect(page).to have_content('Updated: 2023-02-07T17:52:42.579Z')
      expect(page).to have_content('Owner: Test UserOne test_user_1')
      expect(page).to have_content('Notification Level: INFO')
      expect(page).to have_content('Affiliation: GOVERNMENT')
      expect(page).to have_content('User Region: USA')
      expect(page).to have_content('Client Identity: cmr-test-user')

      expect(page).not_to have_link('Resubmit Order')

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
