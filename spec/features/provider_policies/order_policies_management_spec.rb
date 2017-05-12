# MMT-129, MMT-818

require 'rails_helper'

describe 'Viewing Order Policies', js: true do
  context 'when no order policies exist' do
    before do
      login
    end

    context 'when viewing the order policies page' do
      before do
        VCR.use_cassette('echo_soap/provider_service/order_policies/empty', record: :none) do
          visit order_policies_path
        end
      end

      it 'displays the create order policies button' do
        expect(page).to have_content('Create Order Policies')
      end

      context 'when clicking the create order policies button' do
        before do
          collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
          allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

          VCR.use_cassette('echo_soap/provider_service/order_policies/empty', record: :none) do
            click_on 'Create Order Policies'
          end
        end

        it 'displays the new order policies form' do
          expect(page).to have_content('New MMT_2 Order Policies')

          wait_for_ajax
          
          # Check that all 6 results appear on the page
          expect(page).to have_selector('#collections_supporting_duplicate_order_items_fromList option', count: 6)

          # Check for 2 specific results
          expect(page).to have_css('#collections_supporting_duplicate_order_items_fromList option[value="C1200189943-MMT_2"]')
          expect(page).to have_css('#collections_supporting_duplicate_order_items_fromList option[value="C1200189951-MMT_2"]')
        end

        context 'when submitting an invalid order policies form' do
          before do
            fill_in 'Retry Attempts', with: ''
            fill_in 'Retry Wait Time', with: ''

            uncheck 'Cancel'

            fill_in 'End Point', with: ''

            click_on 'Submit'
          end

          it 'displays validation errors within the form' do
            expect(page).to have_content('Retry Attempts is required.')
            expect(page).to have_content('Retry Wait Time is required.')
            expect(page).to have_content('End Point is required.')
          end
        end

        context 'when submitting a valid order policies form' do
          before do
            fill_in 'Retry Attempts', with: 3
            fill_in 'Retry Wait Time', with: 60

            check 'Cancel'

            # Concept ID of the collection 'My testing title 02'
            within '#collections_supporting_duplicate_order_items_fromList' do
              find('option[value="C1200189943-MMT_2"]').select_option
            end

            within '.button-container' do
              find('.add_button').click
            end

            fill_in 'End Point', with: '/path_to.html'

            fill_in 'properties', with: '<test>user provided xml</test>'

            VCR.use_cassette('echo_soap/provider_service/order_policies/create', record: :none) do
              click_on 'Submit'
            end
          end

          it 'successfully creates order policies' do
            expect(page).to have_content('Order Policies successfully created')

            expect(page).to have_content('Retry Attempts: 3')
            expect(page).to have_content('Retry Wait Time: 60')

            expect(page).to have_content('End Point: /path_to.html')
            expect(page).to have_content('Suspend Ordering Until: Ordering Not Suspended')

            expect(page).to have_content('CANCEL')
            expect(page).to have_content('Always Send Status Updates: No')

            expect(page).to have_content('My testing title 02')

            expect(page).to have_content('<test>user provided xml</test>')

            # Button to edit order policies
            expect(page).to have_content('Edit')
          end

          context 'when clicking the edit order policies button' do
            before do
              VCR.use_cassette('echo_soap/provider_service/order_policies/edit', record: :none) do
                click_on 'Edit'
              end
            end

            it 'displays the edit form with fields correctly populated' do
              expect(page).to have_content('Editing MMT_2 Order Policies')

              expect(page).to have_field('retry_attempts', with: 3)
              expect(page).to have_field('retry_wait_time', with: 60)

              expect(page).to have_checked_field('supported_transactions_cancel')

              expect(page).to have_field('end_point', with: '/path_to.html')

              expect(page).to have_css('#collections_supporting_duplicate_order_items_toList option[value="C1200189943-MMT_2"]')
            end

            context 'when submitting the updated values on the order policies form' do
              before do
                fill_in 'Retry Attempts', with: 5
                fill_in 'Retry Wait Time', with: 30

                uncheck 'Cancel'

                VCR.use_cassette('echo_soap/provider_service/order_policies/updated', record: :none) do
                  click_on 'Submit'
                end
              end

              it 'successful updates the order policies' do
                expect(page).to have_content('Order Policies successfully updated')

                expect(page).to have_content('Retry Attempts: 5')
                expect(page).to have_content('Retry Wait Time: 30')

                # expect(page).to have_content('QUOTE')
              end

              context 'when clicking the remove order policies button' do
                before do
                  VCR.use_cassette('echo_soap/provider_service/order_policies/destroy', record: :none) do
                    click_on 'Delete'

                    # Confirmation Dialog
                    click_on 'Yes'
                  end
                end

                it 'deletes the order policies' do
                  expect(page).to have_content('Order Policies successfully removed')

                  expect(page).to have_content('Create Order Policies')
                end
              end
            end
          end

          context 'when clicking on the Test Endpoint Connection button' do
            context 'when the endpoint is valid' do
              before do
                mock_response = Echo::Response.new(Faraday::Response.new(status: 200, body: '<?xml version="1.0" encoding="UTF-8"?>
                  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/>
                      <SOAP-ENV:Body><ns2:TestEndpointConnectionResponse xmlns:ns2="http://echo.nasa.gov/echo/v10" xmlns:ns3="http://echo.nasa.gov/echo/v10/types" xmlns:ns4="http://echo.nasa.gov/echo/v10/faults"/></SOAP-ENV:Body>
                  </SOAP-ENV:Envelope>'))

                allow_any_instance_of(Echo::Provider).to receive(:test_endpoint_connection).and_return(mock_response)

                VCR.use_cassette('echo_soap/provider_service/order_policies/edit', record: :none) do
                  click_on 'Edit'
                end

                fill_in 'End Point', with: 'http://f5eil01v.edn.ecs.nasa.gov/dev07/ewoc/services/OrderFulfillmentPort'
                VCR.use_cassette('echo_soap/provider_service/order_policies/updated-url-1', record: :none) do
                  click_on 'Submit'
                end

                click_on 'Test Endpoint Connection'
                wait_for_ajax
              end

              it 'should display a message that the endpoint test was successful' do
                expect(page).to have_content('Test endpoint connection was successful.')
              end
            end

            context 'when the endpoint is invalid' do
              before do
                mock_response = Echo::Response.new(Faraday::Response.new(status: 500, body: '<?xml version="1.0" encoding="UTF-8"?>
                  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/>
                      <SOAP-ENV:Body>
                          <SOAP-ENV:Fault>
                              <faultcode>SOAP-ENV:Client</faultcode>
                              <faultstring>The endpoint is not a valid URL.</faultstring>
                              <detail>
                                  <ns4:ValidationFault xmlns:ns2="http://echo.nasa.gov/echo/v10" xmlns:ns3="http://echo.nasa.gov/echo/v10/types" xmlns:ns4="http://echo.nasa.gov/echo/v10/faults">
                                      <ns4:ErrorCode>ProviderPoliciesInvalid</ns4:ErrorCode><ns4:OpsMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/>
                                      <ns4:SystemMessage>The endpoint is not a valid URL.</ns4:SystemMessage>
                                      <ns4:Timestamp>2017-03-03T18:42:23.635Z</ns4:Timestamp>
                                      <ns4:ErrorInstanceId>3C7B4E56-ACDA-4E54-359D-17F0AA52F54F</ns4:ErrorInstanceId>
                                      <ns4:ObjectType>Endpoint</ns4:ObjectType>
                                  </ns4:ValidationFault>
                              </detail>
                          </SOAP-ENV:Fault>
                      </SOAP-ENV:Body>
                  </SOAP-ENV:Envelope>'))

                allow_any_instance_of(Echo::Provider).to receive(:test_endpoint_connection).and_return(mock_response)

                VCR.use_cassette('echo_soap/provider_service/order_policies/edit', record: :none) do
                  click_on 'Edit'
                end

                fill_in 'End Point', with: 'fail .com'
                VCR.use_cassette('echo_soap/provider_service/order_policies/updated-url-2', record: :none) do
                  click_on 'Submit'
                end

                click_on 'Test Endpoint Connection'
                wait_for_ajax
              end

              it 'should display a message that the endpoint test was unsuccessful' do
                expect(page).to have_content('The endpoint is not a valid URL.')
              end
            end
          end
        end
      end
    end
  end
end
