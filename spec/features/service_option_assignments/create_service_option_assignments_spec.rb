require 'rails_helper'

describe 'Creating a Service Option Assignment', reset_provider: true, js: true do
  before do
    service_entries_by_provider_response = Echo::Response.new(Faraday::Response.new(status: 200, body: File.read('spec/fixtures/service_management/service_entries_by_provider.xml')))
    allow_any_instance_of(Echo::ServiceManagement).to receive(:get_service_entries_by_provider).and_return(service_entries_by_provider_response)

    # This is hit via an ajax call and cannot be done with VCR because the ajax call ends up
    # in a different thread, and VCR is not threadsafe
    service_entries_response = Echo::Response.new(Faraday::Response.new(status: 200, body: '<?xml version="1.0" encoding="UTF-8"?>
      <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
         <SOAP-ENV:Header />
         <SOAP-ENV:Body>
            <ns3:GetServiceEntriesResponse xmlns:ns3="http://echo.nasa.gov/echo/v10" xmlns:ns2="http://echo.nasa.gov/echo/v10/types" xmlns:ns4="http://echo.nasa.gov/echo/v10/faults">
               <ns3:result>
                  <ns2:Item>
                     <ns2:Guid>A19EDB8C-2253-3B19-E70D-1AC053DAC384</ns2:Guid>
                     <ns2:ProviderGuid>07ACF84C-6360-0BC7-92A8-E95A958DDE12</ns2:ProviderGuid>
                     <ns2:Name>Polaris</ns2:Name>
                     <ns2:Url>http://fritsch.io/dallas</ns2:Url>
                     <ns2:Description>Et nostrum voluptas perferendis eos omnis libero nam.</ns2:Description>
                     <ns2:EntryType>SERVICE_IMPLEMENTATION</ns2:EntryType>
                     <ns2:TagGuids>
                        <ns2:Item>DATASET_07ACF84C-6360-0BC7-92A8-E95A958DDE12_C1200019403-MMT_2</ns2:Item>
                        <ns2:Item>DATASET_07ACF84C-6360-0BC7-92A8-E95A958DDE12_C1200190013-MMT_2</ns2:Item>
                        <ns2:Item>SERVICE-INTERFACE_102DF03A-D4F8-793A-D920-E6D1B11F8A24</ns2:Item>
                     </ns2:TagGuids>
                  </ns2:Item>
               </ns3:result>
            </ns3:GetServiceEntriesResponse>
         </SOAP-ENV:Body>
      </SOAP-ENV:Envelope>'))
    allow_any_instance_of(Echo::ServiceManagement).to receive(:get_service_entries).and_return(service_entries_response)

    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login
  end

  context 'when the user does not have the required permissions' do
    context 'when viewing the new service option assignment form' do
      before do
        visit new_service_option_assignments_path
      end

      it 'displays a not authorized message' do
        expect(page).to have_content('You are not permitted to create new Service Option Assignments.')
      end

      it 'redirects the user' do
        expect(page.current_path).to eq manage_cmr_path
      end
    end

    context 'when viewing the service option assignment display page' do
      before do
        visit service_option_assignments_path

        wait_for_ajax
      end

      it 'does not display a create button' do
        expect(page).not_to have_link('Create a Service Option Assignment')
      end
    end
  end

  context 'when the user has the required permissions' do
    before :all do
      # create a group
      @service_option_assignment_group = create_group(name: 'Service Option Association Group for Permissions [CREATE]', members: ['testuser'])

      # give the group permission to create
      @create_permissions = add_permissions_to_group(@service_option_assignment_group['concept_id'], 'create', 'OPTION_ASSIGNMENT', 'MMT_2')
    end

    after :all do
      delete_group(concept_id: @service_option_assignment_group['concept_id'])

      remove_group_permissions(@create_permissions['concept_id'])
    end

    context 'when viewing the service option assignment display page' do
      before do
        visit service_option_assignments_path

        wait_for_ajax
      end

      it 'displays a create button' do
        expect(page).to have_link('Create a Service Option Assignment')
      end
    end

    context 'when viewing the new service option assignment form' do
      before do
        VCR.use_cassette('echo_soap/service_management_service/service_option_assignments/new', record: :none) do
          visit new_service_option_assignments_path
        end
      end

      it 'displays the service option assignment form' do
        expect(page).to have_content('New MMT_2 Service Option Assignments')

        wait_for_ajax

        expect(page).to have_field('Service Implementation')
        expect(page).to have_field('Service Option')
        expect(page).to have_field('Granules Only?')

        # Check that all 6 results appear on the page
        expect(page).to have_selector('#service_option_assignment_catalog_guid_fromList option', count: 6)

        # Check for 2 specific results
        expect(page).to have_css('#service_option_assignment_catalog_guid_fromList option[value="C1200189943-MMT_2"]')
        expect(page).to have_css('#service_option_assignment_catalog_guid_fromList option[value="C1200189951-MMT_2"]')

        # Check that collections in Chooser are showing version
        within '#dynamic-service-option-assignment-chooser-widget' do
          expect(page).to have_select('service_option_assignment_catalog_guid_fromList', with_options: ["lorem_223 | ipsum", "ID_1 | Mark's Test", "Matthew'sTest_2 | Matthew's Test", "testing 02_01 | My testing title 02", "testing 03_002 | Test test title 03", "New Testy Test_02 | Testy long entry title"])
        end
      end

      context 'when submitting the service option assignment form' do
        context 'with invalid values' do
          before do
            within '#new-service-option-assignment-form' do
              click_on 'Submit'
            end
          end

          it 'displays validation errors within the form' do
            expect(page).to have_content('You must select at least 1 collection.')
          end
        end

        context 'with valid values' do
          before do
            # Makes an ajax call to update the Chooser
            select 'Polaris', from: 'service_entry_guid'

            wait_for_ajax

            select 'Mollis Vehicula', from: 'service_option_definition_guid'

            within '#service_option_assignment_catalog_guid_fromList' do
              # Mark's Test
              find('option[value="C1200060160-MMT_2"]').select_option

              # Matthew's Test
              find('option[value="C1200019403-MMT_2"]').select_option
            end

            within '.button-container' do
              find('.add_button').click
            end

            VCR.use_cassette('echo_soap/service_management_service/service_option_assignments/create', record: :none) do
              within '#new-service-option-assignment-form' do
                click_on 'Submit'
              end
            end
          end

          it 'creates the assignment and displays a confirmation message' do
            expect(page).to have_content('Service Option Assignments successfully created')
          end
        end
      end
    end
  end
end
