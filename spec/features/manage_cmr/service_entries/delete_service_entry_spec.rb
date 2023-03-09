describe 'Deleting a Service Entry', skip: !Rails.configuration.use_legacy_order_service do
  before :all do
    # create a group
    @service_entry_group = create_group(name: 'Service Entries Group for Permissions [DELETE]', members: ['testuser'])

    # give the group permission to delete
    @delete_permissions = add_permissions_to_group(@service_entry_group['concept_id'], 'delete', 'EXTENDED_SERVICE', 'MMT_2')
  end

  after :all do
    remove_group_permissions(@delete_permissions['concept_id'])
    delete_group(concept_id: @service_entry_group['concept_id'])
  end

  before do
    login
  end

  context 'when authorized to delete service entries' do
    let(:guid) { '9A924C8A-CA74-F245-542D-AE1D2D09E932' }

    context 'when viewing the service entry' do
      before do
        VCR.use_cassette('echo_soap/service_management_service/service_entries/view', record: :none) do
          visit service_entry_path(guid)
        end
      end

      context 'when clicking the delete link' do
        before do
          click_link 'Delete'
        end

        it 'asks for confirmation before deleting' do
          expect(page).to have_content('Are you sure you want to delete this service entry?')
        end

        context 'when declining the confirmation dialog', js: true do
          before do
            click_on 'No'
          end

          it 'closes the dialog and remains on the show action ' do
            expect(page.current_path).to eq service_entry_path(guid)
          end
        end

        context 'when accepting the confirmation dialog', js: true do
          before do
            VCR.use_cassette('echo_soap/service_management_service/service_entries/delete', record: :none) do
              click_on 'Yes'
            end
          end

          it 'displays a success message' do
            expect(page).to have_content('Service Entry successfully deleted')
          end

          it 'redirects to the service entry index page' do
            expect(page.current_path).to eq service_entries_path
          end
        end
      end
    end

    context 'when viewing the service entry index page' do
      before do
        VCR.use_cassette('echo_soap/service_management_service/service_entries/list', record: :none) do
          visit service_entries_path
        end
      end

      it 'displays the delete button for each service entry' do
        within '.service-entries-table' do
          expect(page).to have_text('Delete', count: 25)
        end
      end

      context 'when clicking the delete link of one row' do
        before do
          find(:xpath, "//tr[contains(.,'Rigil Kentaurus')]/td/a", text: 'Delete').click
        end

        it 'asks for confirmation before deleting' do
          expect(page).to have_content('Are you sure you want to delete the service entry named \'Rigil Kentaurus\'?')
        end

        context 'when declining the confirmation dialog', js: true do
          before do
            click_on 'No'
          end

          it 'closes the dialog and remains on the index action ' do
            expect(page.current_path).to eq service_entries_path
          end
        end

        context 'when accepting the confirmation dialog', js: true do
          before do
            VCR.use_cassette('echo_soap/service_management_service/service_entries/delete', record: :none) do
              click_on 'Yes'
            end
          end

          it 'displays a success message' do
            expect(page).to have_content('Service Entry successfully deleted')
          end

          it 'redirects to the service entry index page' do
            expect(page.current_path).to eq service_entries_path
          end
        end
      end
    end
  end
end
