require 'rails_helper'

describe 'Cancel Provider Order Items' do
  order_guid = 'test_order_guid'
  cassette_path = 'echo_soap/order_processing_service/cancel_provider_order/'

  context 'when clicking the Cancel Order button on the provider order page', js: true do
    before do
      login

      VCR.use_cassette(cassette_path + 'list', record: :none) do
        visit provider_order_path(order_guid)
      end

      click_on 'Cancel Order'
    end

    context 'when cancelling a single order item' do
      before do
        select 'G1000005028-DEV07', from: 'catalog_items'
        fill_in 'status_message', with: 'Running tests'

        VCR.use_cassette(cassette_path + 'cancel_one', record: :none) do
          click_on 'Cancel Items'
        end
      end

      it 'cancels the order item' do
        expect(page).to have_content('G1000005028-DEV07	CANCELLED')
      end
    end

    context 'when cancelling all order items' do
      before do
        select 'G1000005024-DEV07', from: 'catalog_items'
        select 'G1000005028-DEV07', from: 'catalog_items'
        select 'G1000005034-DEV07', from: 'catalog_items'
        fill_in 'status_message', with: 'Running tests'

        VCR.use_cassette(cassette_path + 'cancel_all', record: :none) do
          click_on 'Cancel Items'
        end
      end

      it 'cancels all order items and the order' do
        expect(page).to have_content('G1000005024-DEV07	CANCELLED')
        expect(page).to have_content('G1000005028-DEV07	CANCELLED')
        expect(page).to have_content('G1000005034-DEV07	CANCELLED')
        expect(page).to have_content('Provider Order State:	CANCELLED')
      end
    end
  end
end
