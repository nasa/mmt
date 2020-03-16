require 'rails_helper'

describe 'Cancel Provider Order Items' do
  let(:order_guid) { 'test_order_guid' }

  context 'when clicking the Manage Order Items button on the provider order page', js: true do
    before do
      login

      VCR.use_cassette('echo_soap/order_processing_service/cancel_provider_order/list', record: :none) do
        visit edit_provider_order_path(order_guid)
      end
    end

    context 'when cancelling a single order item' do
      before do
        select 'G1000005028-DEV07', from: 'catalog_items'
        fill_in 'status_message', with: 'Running tests'

        click_on 'Cancel Items'
      end

      it 'displays a confirmation dialog' do
        expect(page).to have_content('Are you sure you want to cancel the selected items?')
      end

      context 'when clicking yes to confirm the order cancellation' do
        before do
          VCR.use_cassette('echo_soap/order_processing_service/cancel_provider_order/cancel_one', record: :none) do
            click_on 'Yes'
          end
        end

        it 'cancels the order item' do
          expect(page).to have_content('G1000005028-DEV07 CANCELLED')
        end
      end
    end

    context 'when cancelling all order items' do
      before do
        select 'G1000005024-DEV07', from: 'catalog_items'
        select 'G1000005028-DEV07', from: 'catalog_items'
        select 'G1000005034-DEV07', from: 'catalog_items'
        
        fill_in 'status_message', with: 'Running tests'

        click_on 'Cancel Items'
      end

      it 'displays a confirmation dialog' do
        expect(page).to have_content('Are you sure you want to cancel the selected items?')
      end

      context 'when clicking yes to confirm the order cancellation' do
        before do
          VCR.use_cassette('echo_soap/order_processing_service/cancel_provider_order/cancel_all', record: :none) do
            click_on 'Yes'
          end
        end

        it 'cancels all order items and the order' do
          expect(page).to have_content('G1000005024-DEV07 CANCELLED')
          expect(page).to have_content('G1000005028-DEV07 CANCELLED')
          expect(page).to have_content('G1000005034-DEV07 CANCELLED')
          expect(page).to have_content('Provider Order State: CANCELLED')
        end
      end
    end
  end
end
