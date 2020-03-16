describe 'Close Provider Order Items' do
  let(:order_guid) { 'test_order_guid' }

  context 'when clicking the Cancel Order button on the provider order page', js: true do
    before do
      login

      VCR.use_cassette('echo_soap/order_processing_service/close_provider_order/list', record: :none) do
        visit edit_provider_order_path(order_guid)
      end
    end

    context 'when closing a single order item' do
      before do
        select 'G1000005028-DEV07', from: 'catalog_items'
        fill_in 'status_message', with: 'Running tests'

        VCR.use_cassette('echo_soap/order_processing_service/close_provider_order/close_one', record: :none) do
          click_on 'Close Items'
        end
      end

      it 'displays a confirmation dialog' do
        expect(page).to have_content('Are you sure you want to close the selected items?')
      end

      context 'when clicking yes to confirm the closing of the order items' do
        before do
          VCR.use_cassette('echo_soap/order_processing_service/close_provider_order/close_one', record: :none) do
            click_on 'Yes'
          end
        end

        it 'closes the order item' do
          expect(page).to have_content('G1000005028-DEV07 CLOSED')
        end
      end
    end

    context 'when closing all order items' do
      before do
        select 'G1000005024-DEV07', from: 'catalog_items'
        select 'G1000005028-DEV07', from: 'catalog_items'
        select 'G1000005034-DEV07', from: 'catalog_items'
        fill_in 'status_message', with: 'Running tests'

        VCR.use_cassette('echo_soap/order_processing_service/close_provider_order/close_all', record: :none) do
          click_on 'Close Items'
        end
      end

      it 'displays a confirmation dialog' do
        expect(page).to have_content('Are you sure you want to close the selected items?')
      end

      context 'when clicking yes to confirm the closing of the order items' do
        before do
          VCR.use_cassette('echo_soap/order_processing_service/close_provider_order/close_all', record: :none) do
            click_on 'Yes'
          end
        end

        it 'closes all order items and the order' do
          expect(page).to have_content('G1000005024-DEV07 CLOSED')
          expect(page).to have_content('G1000005028-DEV07 CLOSED')
          expect(page).to have_content('G1000005034-DEV07 CLOSED')
          expect(page).to have_content('Provider Order State: CLOSED')
        end
      end
    end
  end
end
