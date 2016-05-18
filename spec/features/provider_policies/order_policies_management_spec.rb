# MMT-129

require 'rails_helper'

describe 'Viewing Order Policies', js: true do
  context 'when no order policies exist' do
    before do
      login
    end

    context 'when viewing the order policies page' do
      before do
        click_on 'Manage CMR'

        VCR.use_cassette('echo_soap/provider_service/order_policies/empty', record: :none) do
          click_on 'Order Policies'
        end
      end

      it 'displays the create order policies button' do
        expect(page).to have_content('No MMT_2 Order Policies found.')
        expect(page).to have_content('Create Order Policies')
      end

      context 'when clicking the create order policies button' do
        before do
          collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
          allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections).and_return(collections_response)

          VCR.use_cassette('echo_soap/provider_service/order_policies/empty', record: :none) do
            click_on 'Create Order Policies'
          end
        end

        it 'displays the new order policies form' do
          expect(page).to have_content('New MMT_2 Order Policies')

          # Check that all 6 results appear on the page
          expect(page).to have_selector('#duplicate-order-items tbody tr', :count => 6)

          # Check for 2 specific results
          expect(page).to have_content('My testing title 02')
          expect(page).to have_content('Test test title 03')
        end

        context 'when submitting an invalid order policies form' do
          before do
            fill_in 'Retry Attempts', with: ''
            fill_in 'Retry Wait Time', with: ''

            uncheck 'Submit'
            uncheck 'Quote'
            uncheck 'Cancel'

            fill_in 'End Point', with: ''

            click_on 'Submit'
          end

          it 'displays validation errors within the form' do
            expect(page).to have_content('Retry Attempts is required.')
            expect(page).to have_content('Retry Wait Time is required.')
            expect(page).to have_content('End Point is required.')
            expect(page).to have_content('Supported Transactions is required.')
          end
        end

        context 'when submitting a valid order policies form' do
          before do
            fill_in 'Retry Attempts', with: 3
            fill_in 'Retry Wait Time', with: 60

            check 'Submit'
            check 'Quote'

            # Concept ID of the collection 'My testing title 02'
            check 'C1200189943-MMT_2'

            fill_in 'End Point', with: '/path_to.html'

            fill_in 'properties', with: '<test>user provided xml</test>'

            VCR.use_cassette('echo_soap/provider_service/order_policies/create', record: :none) do
              click_on 'Submit'
            end
          end

          it 'successfully creates an order policies' do
            expect(page).to have_content('Order Policies successfully created')

            expect(page).to have_content('Retry Attempts: 3')
            expect(page).to have_content('Retry Wait Time: 60')

            expect(page).to have_content('End Point: /path_to.html')
            expect(page).to have_content('Type: ORDER_FULFILLMENT_V9')
            expect(page).to have_content('Suspend Ordering Until: Ordering Not Suspended')

            expect(page).to have_content('QUOTE and SUBMIT')
            expect(page).to have_content('Override Status Notifications: No')

            expect(page).to have_content('<test> user provided xml </test>')

            # Button to edit order policies
            expect(page).to have_content('Edit Order Policies')            
          end

          context 'when clicking the edit order policies button' do
            before do
              VCR.use_cassette('echo_soap/provider_service/order_policies/edit', record: :none) do
                click_on 'Edit Order Policies'
              end
            end

            it 'displays the edit form with fields correctly populated' do
              expect(page).to have_content('Editing MMT_2 Order Policies')

              expect(page).to have_field('retry_attempts', with: 3)
              expect(page).to have_field('retry_wait_time', with: 60)

              expect(page).to have_checked_field('supported_transactions_submit')
              expect(page).to have_checked_field('supported_transactions_quote')

              expect(page).to have_field('end_point', with: '/path_to.html')
              expect(page).to have_field('routing_type', with: 'ORDER_FULFILLMENT_V9')

              expect(page).to have_checked_field('C1200189943-MMT_2')
            end

            context 'when submitting the updated values on the order policies form' do
              before do
                fill_in 'Retry Attempts', with: 5
                fill_in 'Retry Wait Time', with: 30

                uncheck 'Submit'

                VCR.use_cassette('echo_soap/provider_service/order_policies/updated', record: :none) do
                  click_on 'Submit'
                end
              end

              it 'successful updates the order policies' do
                expect(page).to have_content('Order Policies successfully updated')

                expect(page).to have_content('Retry Attempts: 5')
                expect(page).to have_content('Retry Wait Time: 30')

                expect(page).to have_content('QUOTE')
              end
            end
          end
        end
      end
    end
  end
end
