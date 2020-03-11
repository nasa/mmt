describe 'Searching Orders' do
  context 'when viewing the track orders page' do
    before do
      login(provider: 'EDF_OPS', providers: %w(MMT_2 EDF_OPS))

      visit orders_path
    end

    context 'when results include orders with no contact information' do
      let(:guest_order_guid) { 'order-guid-one' }

      before do
        select 'Creation date', from: 'date_type'
        fill_in 'From', with: '2017-04-07T00:00:00'
        fill_in 'To', with: '2017-04-08T00:00:00'

        VCR.use_cassette('echo_soap/order_management_service/results_with_no_contacts', record: :none) do
          within '#track-orders-form' do
            click_on 'Submit'
          end
        end
      end

      it 'displays results including orders with no contact information' do
        within '.orders-table tbody' do
          expect(page).to have_selector('tr', count: 1)

          # There is nothing for 'Contact Name'
          expect(page).to have_content("guest #{guest_order_guid}", normalize_ws: true)
        end
      end
    end

    context 'when viewing a guest order' do
      let(:guest_order_guid) { 'gues-tord-ergu-id01' }

      before do
        VCR.use_cassette('echo_soap/order_management_service/no_contact_order', record: :none) do
          visit order_path(guest_order_guid)
        end
      end

      it 'displays the guest order correctly' do
        # No contact information is visible
        expect(page).to have_content('Contact Information')
        expect(page).to have_content('Role: Name: Organization: Address: Phone: Email: ', normalize_ws: true)
      end
    end
  end
end
