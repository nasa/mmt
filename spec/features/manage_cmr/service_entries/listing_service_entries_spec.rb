describe 'Listing Service Entries' do
  let(:timeout_error_html_body) { File.read(File.join(Rails.root, 'spec', 'fixtures', 'service_management', 'timeout.html')) }

  before :all do
    # create a group
    @service_entry_group = create_group(name: 'Service Entries Group for Permissions [LIST]', members: ['testuser'])
  end

  after :all do
    delete_group(concept_id: @service_entry_group['concept_id'])
  end

  context 'when viewing the index page' do
    before do
      login

      visit manage_cmr_path
    end

    it 'does not display a create button' do
      expect(page).not_to have_link('Create a Service Entry')
    end

    it 'does not display any edit links' do
      expect(page).not_to have_css('a', text: 'Edit')
    end

    it 'does not display any delete links' do
      expect(page).not_to have_css('a', text: 'Delete')
    end

    context 'when there is a timeout error' do
      before do
        # mock a timeout error
        echo_response = echo_fail_response(timeout_error_html_body, status = 504, headers = {'content-type' => 'text/html'})
        allow_any_instance_of(Echo::ServiceManagement).to receive(:get_service_entries_by_provider).and_return(echo_response)

        VCR.use_cassette('echo_soap/service_management_service/service_entries/empty_list', record: :none) do
          visit service_entries_path
        end
      end

      it 'displays the appropriate error message' do
        within '.eui-banner--danger.eui-banner__dismiss' do
          expect(page).to have_content('504 ERROR: We are unable to retrieve service entries at this time. If this error persists, please contact Earthdata Support about')
        end
      end
    end

    context 'when no records exist' do
      before do
        VCR.use_cassette('echo_soap/service_management_service/service_entries/empty_list', record: :none) do
          visit service_entries_path
        end
      end

      it 'provides a message within an empty table' do
        within '.service-entries-table' do
          expect(page).to have_content('No MMT_2 Service Entries found.')
        end
      end
    end

    context 'when records exist' do
      before do
        VCR.use_cassette('echo_soap/service_management_service/service_entries/list', record: :none) do
          visit service_entries_path
        end
      end

      it 'lists all the available service entries' do
        within '.service-entries-table' do
          expect(page).to have_selector('tbody tr', count: 25)
        end
      end

      it 'displays the pagination information header' do
        expect(page).to have_content('Showing Service Entries 1 - 25 of 26')
      end

      it 'displays the pagination navigation' do
        within '.eui-pagination' do
          # First, 1, 2, Next, Last
          expect(page).to have_selector('li', count: 5)
        end
      end

      it 'shows the correct active page' do
        expect(page).to have_css('.active-page', text: '1')
      end

      it 'sorts the list correctly' do
        # First row
        within '.service-entries-table tbody tr:nth-child(1) td:nth-child(1)' do
          expect(page).to have_content('Arcturus')
        end

        # Last row
        within '.service-entries-table tbody tr:last-child td:nth-child(1)' do
          expect(page).to have_content('Whirlpool')
        end
      end

      context 'when clicking through to the second page' do
        before do
          VCR.use_cassette('echo_soap/service_management_service/service_entries/list', record: :none) do
            within '.eui-pagination li:nth-child(3)' do
              click_link '2'
            end
          end
        end

        it 'displays the pagination information for page two' do
          expect(page).to have_content('Showing Service Entry 26 - 26 of 26')
        end

        it 'lists all the available service entries' do
          within '.service-entries-table' do
            expect(page).to have_selector('tbody tr', count: 1)
          end
        end
      end
    end

    context 'when authorized to create service entries' do
      before do
        @create_permissions = add_permissions_to_group(@service_entry_group['concept_id'], 'create', 'EXTENDED_SERVICE', 'MMT_2')

        VCR.use_cassette('echo_soap/service_management_service/service_entries/list', record: :none) do
          visit service_entries_path
        end
      end

      after do
        remove_group_permissions(@create_permissions['concept_id'])
      end

      it 'displays an edit button for each record' do
        expect(page).to have_link('Create a Service Entry')
      end
    end

    context 'when authorized to edit service entries' do
      before do
        @update_permissions = add_permissions_to_group(@service_entry_group['concept_id'], 'update', 'EXTENDED_SERVICE', 'MMT_2')

        VCR.use_cassette('echo_soap/service_management_service/service_entries/list', record: :none) do
          visit service_entries_path
        end
      end

      after do
        remove_group_permissions(@update_permissions['concept_id'])
      end

      it 'displays an edit button for each record' do
        within '.service-entries-table' do
          expect(page).to have_css('a', text: 'Edit', count: 25)
        end
      end
    end

    context 'when authorized to delete service entries' do
      before do
        @delete_permissions = add_permissions_to_group(@service_entry_group['concept_id'], 'delete', 'EXTENDED_SERVICE', 'MMT_2')

        VCR.use_cassette('echo_soap/service_management_service/service_entries/list', record: :none) do
          visit service_entries_path
        end
      end

      after do
        remove_group_permissions(@delete_permissions['concept_id'])
      end

      it 'displays a delete button for each record' do
        within '.service-entries-table' do
          expect(page).to have_css('a', text: 'Delete', count: 25)
        end
      end
    end
  end
end
