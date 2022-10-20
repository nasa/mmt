# EDL Failed Test
describe 'Viewing a Service Entry', reset_provider: true, skip: true do
  before :all do
    # create a group
    VCR.use_cassette('edl', record: :new_episodes) do
      @service_entry_group = create_group(name: 'Service_Entries_Group_for_Permissions_[VIEW]', members: ['testuser'])
    end
  end

  after :all do
    VCR.use_cassette('edl', record: :new_episodes) do
      delete_group(concept_id: @service_entry_group['group_id'])
    end
  end

  before do
    collections_response = Cmr::Response.new(Faraday::Response.new(status: 200, body: JSON.parse(File.read('spec/fixtures/cmr_search.json'))))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login
  end

  context 'when viewing the service entry' do
    let(:guid) { 'E7B6371A-31CD-0AAC-FF18-78A78289BD65' }

    context 'with no permissions' do
      before do
        VCR.use_cassette('echo_soap/service_management_service/service_entries/view', record: :none) do
          visit service_entry_path(guid)
        end
      end

      it 'does not display an edit button' do
        expect(page).not_to have_link('Edit')
      end

      it 'does not display a delete button' do
        expect(page).not_to have_link('Delete')
      end

      it 'displays the service entry details' do
        expect(page).to have_content('Wolf 359')
        expect(page).to have_content('http://earthdata.nasa.gov')
        expect(page).to have_content('Ea qui natus nobis.')

        within '#tag-list' do
          expect(page).to have_content('Mark\'s Test')
          expect(page).to have_content('Matthew\'s Test')
        end
      end
    end

    context 'when authorized to edit service entries' do
      before do
        @update_permissions = add_permissions_to_group(@service_entry_group['group_id'], 'update', 'EXTENDED_SERVICE', 'MMT_2')

        VCR.use_cassette('echo_soap/service_management_service/service_entries/view', record: :none) do
          visit service_entry_path(guid)
        end
      end

      after do
        remove_group_permissions(@update_permissions['concept_id'])
      end

      it 'displays an edit button for each record' do
        expect(page).to have_link('Edit')
      end
    end

    context 'when authorized to delete service entries' do
      before do
        @delete_permissions = add_permissions_to_group(@service_entry_group['group_id'], 'delete', 'EXTENDED_SERVICE', 'MMT_2')

        VCR.use_cassette('echo_soap/service_management_service/service_entries/view', record: :none) do
          visit service_entry_path(guid)
        end
      end

      after do
        remove_group_permissions(@delete_permissions['concept_id'])
      end

      it 'displays a delete button for each record' do
        expect(page).to have_link('Delete')
      end
    end
  end
end
