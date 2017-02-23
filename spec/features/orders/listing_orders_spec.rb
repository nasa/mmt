require 'rails_helper'

describe 'Searching Orders' do
  context 'when viewing the track orders page' do
    before do
      login

      visit orders_path
    end

    context 'when their are no results' do
      before do
        select 'Creation date', from: 'date_type'
        fill_in 'From', with: '2017-01-31T00:00:00'
        fill_in 'To', with: '2017-02-01T00:00:00'

        VCR.use_cassette('echo_soap/order_management_service/no_results', record: :none) do
          click_on 'Display Orders'
        end
      end

      it 'displays no orders' do
        expect(page).to have_content 'No MMT_2 orders found'
      end
    end

    context 'when searching by order guid' do
      before do
        fill_in 'Order GUID', with: 'order_guid'

        VCR.use_cassette('echo_soap/order_management_service/search_by_guid', record: :none) do
          click_on 'Display Orders'
        end
      end

      it 'displays the matching order' do
        within '.orders-table tbody' do
          expect(page).to have_selector('tr', count: 1)

          within 'tr:first-child' do
            expect(page).to have_link('View Provider Order', href: '/provider_orders/order_guid')
            expect(page).to have_link('CLOSED', href: '/orders/order_guid')
          end
        end
      end
    end

    context 'when searching by order state and date' do
      before do
        select 'SUBMIT_FAILED', from: 'states'

        select 'Creation date', from: 'date_type'
        fill_in 'From', with: '2017-01-25T00:00:00'
        fill_in 'To', with: '2017-01-31T00:00:00'

        VCR.use_cassette('echo_soap/order_management_service/search_by_state_and_date', record: :none) do
          click_on 'Display Orders'
        end
      end

      it 'displays the matching orders' do
        within '.orders-table tbody' do
          expect(page).to have_selector('tr', count: 2)

          within 'tr:first-child' do
            expect(page).to have_link('View Provider Order', href: '/provider_orders/order_guid_1')
            expect(page).to have_link('SUBMITTED_WITH_EXCEPTIONS', href: '/orders/order_guid_1')
          end

          within 'tr:last-child' do
            expect(page).to have_link('View Provider Order', href: '/provider_orders/order_guid_2')
            expect(page).to have_link('SUBMITTED_WITH_EXCEPTIONS', href: '/orders/order_guid_2')
          end
        end
      end
    end

    context 'when searching by user id' do
      before do
        fill_in 'Filter by User ID', with: 'user_1'
        select 'Creation date', from: 'date_type'
        fill_in 'From', with: '2017-01-25T00:00:00'
        fill_in 'To', with: '2017-01-31T00:00:00'

        # user filtering is done after the soap call, so the cassette would be the same as search by date
        VCR.use_cassette('echo_soap/order_management_service/search_by_date', record: :none) do
          click_on 'Display Orders'
        end
      end

      it 'displays the matching orders' do
        expect(page).to have_selector('.orders-table tbody tr', count: 1)
      end
    end

    context 'when searching by date' do
      before do
        select 'Creation date', from: 'date_type'
        fill_in 'From', with: '2017-01-25T00:00:00'
        fill_in 'To', with: '2017-01-31T00:00:00'

        VCR.use_cassette('echo_soap/order_management_service/search_by_date', record: :none) do
          click_on 'Display Orders'
        end
      end

      it 'displays the matching orders' do
        expect(page).to have_selector('.orders-table tbody tr', count: 2)
      end
    end
  end
end
