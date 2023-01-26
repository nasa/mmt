describe 'Viewing Order Policies', js: true do
  let(:timeout_error_html_body) { File.read(File.join(Rails.root, 'spec', 'fixtures', 'service_management', 'timeout.html')) }

  context 'when no order policies exist' do
    before do
      login
    end

    context 'when viewing the order policies page and there is a timeout error' do
      before do
        # mock a timeout error
        cmr_response = cmr_fail_response(timeout_error_html_body, status = 504)
        allow_any_instance_of(Cmr::GraphqlClient).to receive(:get_provider_policy).and_return(cmr_response)
        visit order_policies_path
      end

      it 'displays the appropriate error message' do
        within '.eui-banner--danger.eui-banner__dismiss' do
          expect(page).to have_content('504 ERROR: We are unable to retrieve providers policies at this time. If this error persists, please contact Earthdata Support about')
        end
      end
    end

    context 'when viewing the order policies page' do
      before do
        VCR.use_cassette("provider_policies/#{File.basename(__FILE__, '.rb')}_order_policies_empty_vcr", record: :none) do
          visit order_policies_path
        end
      end

      it 'displays the create order policies button' do
        expect(page).to have_content('Create Order Policies')
      end

      context 'when clicking the create order policies button' do
        before do
          VCR.use_cassette("provider_policies/#{File.basename(__FILE__, '.rb')}_order_policies_empty_vcr", record: :none) do
            click_on 'Create Order Policies'
          end
        end

        it 'displays the new order policies form' do
          expect(page).to have_content('New MMT_2 Order Policies')

          expect(page).to have_content('Retry Information')
          expect(page).to have_content('Retry Attempts')
          expect(page).to have_field('retry_attempts')
          expect(page).to have_content('Retry Wait Time')
          expect(page).to have_field('retry_wait_time')
        end

        context 'when submitting an invalid order policies form' do
          before do
            fill_in 'Retry Attempts', with: ''
            fill_in 'Retry Wait Time', with: ''
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

            fill_in 'End Point', with: '/path_to.html'

            fill_in 'properties', with: '<test>user provided xml</test>'

            VCR.use_cassette("provider_policies/#{File.basename(__FILE__, '.rb')}_submit_order_policies_vcr", record: :none) do
              click_on 'Submit'
            end
          end

          it 'successfully creates order policies' do
            expect(page).to have_content('Order Policies successfully created')

            expect(page).to have_content('Retry Attempts: 3')
            expect(page).to have_content('Retry Wait Time: 60')

            expect(page).to have_content('End Point: /path_to.html')
            expect(page).to have_content('Suspend Ordering Until: Ordering Not Suspended')

            expect(page).to have_content('Always Send Status Updates: No')

            expect(page).to have_content('<test>user provided xml</test>')

            # Button to edit order policies
            expect(page).to have_content('Edit')
          end

          context 'when clicking the edit order policies button' do
            before do
              VCR.use_cassette("provider_policies/#{File.basename(__FILE__, '.rb')}_edit_order_policies_vcr", record: :none) do
                click_on 'Edit'
              end
            end

            it 'displays the edit form with fields correctly populated' do
              expect(page).to have_content('Editing MMT_2 Order Policies')

              expect(page).to have_field('retry_attempts', with: 3)
              expect(page).to have_field('retry_wait_time', with: 60)

              expect(page).to have_field('end_point', with: '/path_to.html')
            end

            context 'when submitting the updated values on the order policies form' do
              before do
                fill_in 'Retry Attempts', with: 5
                fill_in 'Retry Wait Time', with: 30

                VCR.use_cassette("provider_policies/#{File.basename(__FILE__, '.rb')}_submit_updated_order_policies_vcr", record: :none) do
                  click_on 'Submit'
                end
              end

              it 'successful updates the order policies' do
                expect(page).to have_content('Order Policies successfully updated')

                expect(page).to have_content('Retry Attempts: 5')
                expect(page).to have_content('Retry Wait Time: 30')
              end

              context 'when clicking the remove order policies button' do
                before do
                  VCR.use_cassette("provider_policies/#{File.basename(__FILE__, '.rb')}_delete_order_policies_vcr", record: :none) do
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
                mock_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: '{"data":{"testProviderConnection":{"status":200}}}'))
                allow_any_instance_of(Cmr::GraphqlClient).to receive(:test_endpoint_connection).and_return(mock_response)
                click_on 'Test Endpoint Connection'
                wait_for_jQuery
              end

              it 'should display a message that the endpoint test was successful' do
                expect(page).to have_content('Test endpoint connection was successful.')
              end
            end

            context 'when the endpoint is invalid' do
              before do
                mock_response = Cmr::Response.new(Faraday::Response.new(response_headers: {}, status: 500, body: '{"errors":[{"message":"An unknown error occurred. Please refer to the ID d84a338e-0bb6-4051-b8d5-09febad7fd74 when contacting Earthdata Operations (support@earthdata.nasa.gov).","locations":[{"line":2,"column":27}],"path":["testProviderConnection"],"extensions":{"code":"INTERNAL_SERVER_ERROR","exception":{"stacktrace":["Error: An unknown error occurred. Please refer to the ID d84a338e-0bb6-4051-b8d5-09febad7fd74 when contacting Earthdata Operations (support@earthdata.nasa.gov).","    at Object.\u003canonymous\u003e (/var/task/src/graphql/handler.js:1:106987)","    at Generator.next (\u003canonymous\u003e)","    at At (/var/task/src/graphql/handler.js:1:105980)","    at o (/var/task/src/graphql/handler.js:1:106866)","    at /var/task/src/graphql/handler.js:1:106927","    at new Promise (\u003canonymous\u003e)","    at Object.\u003canonymous\u003e (/var/task/src/graphql/handler.js:1:106806)","    at Object.fallbackError (/var/task/src/graphql/handler.js:1:107162)","    at middleware (/var/task/node_modules/graphql-shield/dist/generator.js:51:42)","    at processTicksAndRejections (node:internal/process/task_queues:96:5)"]}}}],"data":{"testProviderConnection":null}}'))

                allow_any_instance_of(Cmr::GraphqlClient).to receive(:test_endpoint_connection).and_return(mock_response)

                click_on 'Test Endpoint Connection'
                wait_for_jQuery
              end

              it 'should display a message that the endpoint test was unsuccessful' do
                expect(page).to have_content('Test endpoint connection failed. Please try again.')
              end
            end
          end
        end
      end
    end
  end
end
