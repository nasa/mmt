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
          within '#track-orders-form' do
            click_on 'Submit'
          end
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
          within '#order-by-guid-form' do
            click_on 'Submit'
          end
        end
      end

      it 'displays the matching order' do
        within '.orders-table tbody' do
          expect(page).to have_selector('tr', count: 1)

          within 'tr:first-child' do
            # State
            expect(page).to have_link('CLOSED', href: '/orders/order_guid')
            # Contact
            expect(page).to have_link('User One user_1', href: 'mailto:user@example.com')
            # View Provider Order (by GUID)
            expect(page).to have_link('order_guid', href: '/provider_orders/order_guid')
            # Tracking ID
            expect(page).to have_content('0600030377')
          end
        end
      end
    end

    context 'when searching by order guid that is not validated' do
      before do
        fill_in 'Order GUID', with: 'order_guid'

        VCR.use_cassette('echo_soap/order_management_service/search_by_guid_results_not_validated', record: :none) do
          within '#order-by-guid-form' do
            click_on 'Submit'
          end
        end
      end
      it 'displays the matching order' do
        within '.orders-table tbody' do
          expect(page).to have_selector('tr', count: 1)

          within 'tr:first-child' do
            # State
            expect(page).to have_link('NOT_VALIDATED', href: '/orders/order_guid')
            # not submited
            expect(page).to have_content('Not Submited')
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
          within '#track-orders-form' do
            click_on 'Submit'
          end
        end
      end

      it 'displays the matching orders' do
        within '.orders-table tbody' do
          expect(page).to have_selector('tr', count: 2)

          within 'tr:first-child' do
            # State
            expect(page).to have_link('SUBMITTED_WITH_EXCEPTIONS', href: '/orders/order_guid_1')
            # Contact
            expect(page).to have_link('Test UserOne test_user_1', href: 'mailto:testuser1@example.com')
            # View Provider Order (by GUID)
            expect(page).to have_link('order_guid_1', href: '/provider_orders/order_guid_1')
            # Tracking ID
            expect(page).to have_content('1234567890')
          end

          within 'tr:last-child' do
            # State
            expect(page).to have_link('SUBMITTED_WITH_EXCEPTIONS', href: '/orders/order_guid_2')
            # Contact
            expect(page).to have_link('Test UserTwo user_2', href: 'mailto:testuser2@example.com')
            # View Provider Order (by GUID)
            expect(page).to have_link('order_guid_2', href: '/provider_orders/order_guid_2')
            # Tracking ID
            expect(page).to have_content('0987654321')
          end
        end
      end

      context 'when clicking on the "Submitted" column', js: true do
        before do
          find('#order-tracking-search-results thead th:nth-child(3)').click
        end

        it 'it sorts the table by Submitted date in ascending order' do
          within '#order-tracking-search-results tbody' do
            within 'tr:first-child' do
              # State
              expect(page).to have_link('SUBMITTED_WITH_EXCEPTIONS', href: '/orders/order_guid_1')
              # Contact
              expect(page).to have_link('Test UserOne test_user_1', href: 'mailto:testuser1@example.com')
              # View Provider Order (by GUID)
              expect(page).to have_link('order_guid_1', href: '/provider_orders/order_guid_1')
              # Tracking ID
              expect(page).to have_content('1234567890')
            end

            within 'tr:last-child' do
              # State
              expect(page).to have_link('SUBMITTED_WITH_EXCEPTIONS', href: '/orders/order_guid_2')
              # Contact
              expect(page).to have_link('Test UserTwo user_2', href: 'mailto:testuser2@example.com')
              # View Provider Order (by GUID)
              expect(page).to have_link('order_guid_2', href: '/provider_orders/order_guid_2')
              # Tracking ID
              expect(page).to have_content('0987654321')
            end
          end
        end

        context 'when clicking on the "Submitted" column again' do
          before do
            find('#order-tracking-search-results thead th:nth-child(3)').click
          end

          it 'it sorts the table by Submitted date in descending order' do
            within '#order-tracking-search-results tbody' do
              within 'tr:last-child' do
                # State
                expect(page).to have_link('SUBMITTED_WITH_EXCEPTIONS', href: '/orders/order_guid_1')
                # Contact
                expect(page).to have_link('Test UserOne test_user_1', href: 'mailto:testuser1@example.com')
                # View Provider Order (by GUID)
                expect(page).to have_link('order_guid_1', href: '/provider_orders/order_guid_1')
                # Tracking ID
                expect(page).to have_content('1234567890')
              end

              within 'tr:first-child' do
                # State
                expect(page).to have_link('SUBMITTED_WITH_EXCEPTIONS', href: '/orders/order_guid_2')
                # Contact
                expect(page).to have_link('Test UserTwo user_2', href: 'mailto:testuser2@example.com')
                # View Provider Order (by GUID)
                expect(page).to have_link('order_guid_2', href: '/provider_orders/order_guid_2')
                # Tracking ID
                expect(page).to have_content('0987654321')
              end
            end
          end
        end
      end

      context 'when filtering by the "Contact" column', js: true do
        before do
          find('#order-tracking-search-results thead tr.tablesorter-filter-row td:nth-child(5) input').fill_in with: 'UserTwo'
        end

        it 'filters the results' do
          within '#order-tracking-search-results tbody' do
            expect(page).to have_selector('tr', count: 1)

            # State
            expect(page).to have_link('SUBMITTED_WITH_EXCEPTIONS', href: '/orders/order_guid_2')
            # Contact
            expect(page).to have_link('Test UserTwo user_2', href: 'mailto:testuser2@example.com')
            # View Provider Order (by GUID)
            expect(page).to have_link('order_guid_2', href: '/provider_orders/order_guid_2')
            # Tracking ID
            expect(page).to have_content('0987654321')
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
          within '#track-orders-form' do
            click_on 'Submit'
          end
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
          within '#track-orders-form' do
            click_on 'Submit'
          end
        end
      end

      it 'displays the matching orders' do
        expect(page).to have_selector('.orders-table tbody tr', count: 2)
      end
    end

    context 'when searching with bad token' do
      before do
        fill_in 'Order GUID', with: 'bad_token'


        VCR.use_cassette('echo_soap/order_management_service/provider_orders/bad_token', record: :none) do
          within '#order-by-guid-form' do
            click_on 'Submit'
          end
        end
      end

      it 'has a descriptive error message' do
        expect(page).to have_content('Token [xxx] has expired.')
      end
    end

    context 'with no matching GUID' do
      before do
        fill_in 'Order GUID', with: 'bad_guid_test'


        VCR.use_cassette('echo_soap/order_management_service/provider_orders/bad_guid_test', record: :none) do
          within '#order-by-guid-form' do
            click_on 'Submit'
          end
        end
      end

      it 'has a descriptive error message' do
        expect(page).to have_content('Could not find order with guid')
        expect(page).to have_no_content('Error response returned')
      end
    end
  end
end
