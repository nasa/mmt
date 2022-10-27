# EDL Failed Test
describe 'Creating a Service Entry', js: true do
  before do
    @token = 'jwt_access_token'
    allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
    allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_token')
    # create a group
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      @service_entry_group = create_group(provider_id: nil, name: 'Service_Entry_Group_15', members: ['admin'])
    end
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)
    login
  end

  # after :all do
  #   VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
  #     puts("delete_group:#{@service_entry_group['group_id']}")
  #     delete_group(concept_id: @service_entry_group['group_id'])
  #   end
  # end

  # before do
  #   collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
  #   allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)
  #   login
  # end

  context 'when the user does not have the required permissions' do
    context 'when viewing the new service entry form' do
      before do
        VCR.use_cassette('echo_soap/service_management_service/service_entries/new', record: :none) do
          visit new_service_entry_path
          # screenshot_and_open_image
        end
      end

      it 'displays a not authorized message' do
        expect(page).to have_content('You are not permitted to create new Service Entries.')
      end

      it 'redirects the user' do
        expect(page.current_path).to eq manage_cmr_path
      end
    end
  end

  context 'when the user has the required permissions' do
    before do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @token = 'jwt_access_token'
        allow_any_instance_of(ApplicationController).to receive(:echo_provider_token).and_return(@token)
        allow_any_instance_of(Cmr::UrsClient).to receive(:get_client_token).and_return('client_token')
        # cmr_client.delete_permission('ACL1200443647-CMR', @token)
        @group_permissions = add_permissions_to_group(@service_entry_group['group_id'], 'create', 'EXTENDED_SERVICE', 'MMT_2', @token)
        puts("Group permission=#{@group_permissions}")
        allow_any_instance_of(ServiceEntryPolicy).to receive(:create?).and_return(true)
      end
    end

    # after :all do
    #   VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :new_episodes) do
    #     puts("remove_group_permissions:#{@group_permissions['concept_id']}")
    #     remove_group_permissions(@group_permissions['concept_id'])
    #   end
    # end

    context 'when viewing the new service entry form' do
      before do
        VCR.use_cassette('echo_soap/service_management_service/service_entries/new', record: :none) do
          visit new_service_entry_path
        end
      end

      it 'displays the service entry form' do
        expect(page).to have_content('New MMT_2 Service Entry')

        wait_for_jQuery

        # Check that all 6 results appear on the page
        expect(page).to have_selector('#tag_guids_fromList option', count: 6)

        # Check for 2 specific results
        expect(page).to have_css('#tag_guids_fromList option[value="C1200189943-MMT_2"]')
        expect(page).to have_css('#tag_guids_fromList option[value="C1200189951-MMT_2"]')
      end

      it 'displays a enabled entry type field' do
        expect(page).to have_field('Type', disabled: false)
      end

      context 'when submitting the service entry form' do
        context 'with invalid values', js: true do
          before do
            within '#service-entry-form' do
              click_on 'Submit'
            end
          end

          it 'displays validation errors within the form' do
            expect(page).to have_content('Name is required.')
            expect(page).to have_content('URL is required.')
            expect(page).to have_content('Description is required.')
          end

          context 'when creating a service implementation' do
            before do
              within '#service-entry-form' do
                # Selecting this option will make the Service Interface field appear
                within '#service_entry_entry_type' do
                  find('option[value="SERVICE_IMPLEMENTATION"]').select_option
                end

                click_on 'Submit'
              end
            end

            it 'displays the service interface field' do
              expect(page).to have_field('Service Interface')
            end

            context 'when a service interface is not selected' do
              before do
                within '#service-entry-form' do
                  # Selecting this option will make the Service Interface field appear
                  within '#service_entry_entry_type' do
                    find('option[value="SERVICE_IMPLEMENTATION"]').select_option
                  end

                  click_on 'Submit'
                end
              end

              it 'displays validation errors within the form' do
                expect(page).to have_content('Service Interface is required when creating a Service Implementation.')
              end
            end
          end
        end

        context 'with valid values' do
          let(:name)        { 'Wolf 359' }
          let(:url)         { 'http://earthdata.nasa.gov' }
          let(:description) { 'Ea qui natus nobis.' }

          before do
            fill_in 'Name', with: name
            fill_in 'URL', with: url
            fill_in 'Description', with: description

            within '#tag_guids_fromList' do
              # Mark's Test
              find('option[value="C1200060160-MMT_2"]').select_option

              # Matthew's Test
              find('option[value="C1200019403-MMT_2"]').select_option
            end

            within '.button-container' do
              find('.add_button').click
            end

            VCR.use_cassette('echo_soap/service_management_service/service_entries/create', record: :none) do
              within '#service-entry-form' do
                click_on 'Submit'
              end
            end
          end

          it 'creates the service entry and displays a confirmation message' do
            expect(page).to have_content('Service Entry successfully created')
          end
        end
      end
    end
  end
end
