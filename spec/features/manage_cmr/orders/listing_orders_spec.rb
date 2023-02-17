describe 'Searching Orders', js: true do
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

        VCR.use_cassette("orders/#{File.basename(__FILE__, '.rb')}_no_result_vcr", record: :none) do
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

        VCR.use_cassette("orders/#{File.basename(__FILE__, '.rb')}_search_by_guid_vcr", record: :none) do
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
            expect(page).to have_content('CLOSED')
            # Contact
            expect(page).to have_link('User One user_1', href: 'mailto:user@example.com')
            # View Order (by GUID)
            expect(page).to have_link('order_guid', href: '/orders/order_guid')
            # Tracking ID
            expect(page).to have_content('600031842')
            # Created date
            expect(page).to have_content('2023-02-06 14:57')
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

        VCR.use_cassette("orders/#{File.basename(__FILE__, '.rb')}_search_by_state_date_vcr", record: :none) do
          within '#track-orders-form' do
            click_on 'Submit'
          end
        end
      end

      it 'displays the matching orders' do
        within '.orders-table tbody' do
          expect(page).to have_selector('tr', count: 3)

          within 'tr:first-child' do
            # State
            expect(page).to have_content('SUBMIT_FAILED')
            # Contact
            expect(page).to have_link('Test UserOne test_user_1', href: 'mailto:testuser1@example.com')
            # View Provider Order (by GUID)
            expect(page).to have_link('order_guid_1', href: '/orders/order_guid_1')
            # Tracking ID
            expect(page).to have_content('600031841')
          end

          within 'tr:last-child' do
            # State
            expect(page).to have_content('SUBMIT_FAILED')
            # Contact
            expect(page).to have_link('Test UserThree test_user_3', href: 'mailto:testuser3@example.com')
            # View Provider Order (by GUID)
            expect(page).to have_link('order_guid_3', href: '/orders/order_guid_3')
            # Tracking ID
            expect(page).to have_content('600031843')
          end
        end
      end

      context 'when clicking on the "Submitted" column' do
        before do
          find('#order-tracking-search-results thead th:nth-child(3)').click
        end

        it 'it sorts the table by Submitted date in ascending order' do
          within '#order-tracking-search-results tbody' do
            within 'tr:first-child' do
              # State
              expect(page).to have_content('SUBMIT_FAILED')
              # Contact
              expect(page).to have_link('Test UserThree test_user_3', href: 'mailto:testuser3@example.com')
              # View Provider Order (by GUID)
              expect(page).to have_link('order_guid_3', href: '/orders/order_guid_3')
              # Tracking ID
              expect(page).to have_content('600031843')
            end

            within 'tr:last-child' do
              # State
              expect(page).to have_content('SUBMIT_FAILED')
              # Contact
              expect(page).to have_link('Test UserTwo user_2', href: 'mailto:testuser2@example.com')
              # View Provider Order (by GUID)
              expect(page).to have_link('order_guid_2', href: '/orders/order_guid_2')
              # Tracking ID
              expect(page).to have_content('600031842')
            end
          end
        end

        context 'when clicking on the "Submitted" column again' do
          before do
            find('#order-tracking-search-results thead th:nth-child(3)').click
          end

          it 'it sorts the table by Submitted date in descending order' do
            within '#order-tracking-search-results tbody' do
              within 'tr:first-child' do
                # State
                expect(page).to have_content('SUBMIT_FAILED')
                # Contact
                expect(page).to have_link('Test UserTwo user_2', href: 'mailto:testuser2@example.com')
                # View Provider Order (by GUID)
                expect(page).to have_link('order_guid_2', href: '/orders/order_guid_2')
                # Tracking ID
                expect(page).to have_content('600031842')
              end

              within 'tr:last-child' do
                # State
                expect(page).to have_content('SUBMIT_FAILED')
                # Contact
                expect(page).to have_link('Test UserThree test_user_3', href: 'mailto:testuser3@example.com')
                # View Provider Order (by GUID)
                expect(page).to have_link('order_guid_3', href: '/orders/order_guid_3')
                # Tracking ID
                expect(page).to have_content('600031843')
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
            expect(page).to have_content('SUBMIT_FAILED')
            # Contact
            expect(page).to have_link('Test UserTwo user_2', href: 'mailto:testuser2@example.com')
            # View Provider Order (by GUID)
            expect(page).to have_link('order_guid_2', href: '/orders/order_guid_2')
            # Tracking ID
            expect(page).to have_content('600031842')
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

        VCR.use_cassette("orders/#{File.basename(__FILE__, '.rb')}_search_by_user_date_vcr", record: :none) do
          within '#track-orders-form' do
            click_on 'Submit'
          end
        end
      end

      it 'displays the matching orders' do
        expect(page).to have_selector('.orders-table tbody tr', count: 1)
      end
    end
  end
end
