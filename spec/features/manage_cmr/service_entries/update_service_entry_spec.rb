describe 'Updating a Service Entry', reset_provider: true do
  let(:guid) { 'E7B6371A-31CD-0AAC-FF18-78A78289BD65' }

  before :all do
    # create a group
    @service_entry_group = create_group(name: 'Service Entry Group', members: ['testuser'])

    wait_for_cmr
  end

  after :all do
    delete_group(concept_id: @service_entry_group['concept_id'])
  end

  before do
    collections_response = cmr_success_response(File.read('spec/fixtures/cmr_search.json'))
    allow_any_instance_of(Cmr::CmrClient).to receive(:get_collections_by_post).and_return(collections_response)

    login
  end

  context 'when viewing the edit service entry form' do
    context 'when the user does not have the required permissions' do
      before do
        VCR.use_cassette('echo_soap/service_management_service/service_entries/edit', record: :none) do
          visit edit_service_entry_path(guid)
        end
      end

      it 'displays a not authorized message' do
        expect(page).to have_content('You are not permitted to update Service Entries.')
      end

      it 'redirects the user' do
        expect(page.current_path).to eq manage_cmr_path
      end
    end

    context 'when the user has the required permissions', js: true do
      before :all do
        @group_permissions = add_permissions_to_group(@service_entry_group['concept_id'], 'update', 'EXTENDED_SERVICE', 'MMT_2')
      end

      after :all do
        remove_group_permissions(@group_permissions['concept_id'])
      end

      before do
        VCR.use_cassette('echo_soap/service_management_service/service_entries/edit', record: :none) do
          visit edit_service_entry_path(guid)
        end
      end

      it 'displays the service entry form' do
        expect(page).to have_content('Editing Wolf 359')

        wait_for_jQuery

        # Check that all 6 results appear on the page
        expect(page).to have_selector('#tag_guids_fromList option', count: 6)

        # Check for 2 specific results
        expect(page).to have_css('#tag_guids_fromList option[value="C1200189943-MMT_2"]')
        expect(page).to have_css('#tag_guids_fromList option[value="C1200189951-MMT_2"]')
      end

      it 'displays a disabled entry type field' do
        expect(page).to have_field('Type', disabled: true)
      end

      context 'when using the Chooser widget' do
        it 'sorts the left and right panels of the chooser widget in alphabetical order' do
          expect(page).to have_css('#tag_guids_fromList option:first-child', text: "🟠 ID_1 | Mark's Test")
          expect(page).to have_css('#tag_guids_fromList option:last-child', text: 'testing 03_002 | Test test title 03')

          expect(page).to have_css('#tag_guids_toList option:first-child', text: "🟠 ID_1 | Mark's Test")
          expect(page).to have_css('#tag_guids_toList option:last-child', text: 'testing 03_002 | Test test title 03')
        end
      end

      context 'when adding and removing items between panels in the Chooser widget' do
        before do
          # Remove and add back the first option
          select "ID_1 | Mark's Test", from: 'tag_guids_fromList'
          find('.remove_button').click
          select "ID_1 | Mark's Test", from: 'tag_guids_toList'
          find('.add_button').click

          # Remove and add back the second option
          # also, press esc after select to hide tool tip, it blocks button
          select "lorem_223 | ipsum", from: 'tag_guids_fromList'
          page.find('body').native.send_keys :escape
          find('.remove_button').click

          select "lorem_223 | ipsum", from: 'tag_guids_toList'
          find('.add_button').click
        end

        it 'maintains the sort order on the right panel of the chooser widget' do
          # "From" list (the order always remains the same since items are not removed when added to the right side)
          expect(page).to have_css('#tag_guids_fromList option:first-child', text: "🟠 ID_1 | Mark's Test")
          expect(page).to have_css('#tag_guids_fromList option:last-child', text: 'testing 03_002 | Test test title 03')

          # "To" list
          expect(page).to have_css('#tag_guids_toList option:first-child', text: "🟠 ID_1 | Mark's Test")
          expect(page).to have_css('#tag_guids_toList option:nth-child(2)', text: 'lorem_223 | ipsum')
          expect(page).to have_css('#tag_guids_toList option:last-child', text: 'testing 03_002 | Test test title 03')
        end
      end

      context 'when submitting the service entry form' do
        context 'with invalid values' do
          before do
            fill_in 'Name', with: ''

            within '#service-entry-form' do
              click_on 'Submit'
            end
          end

          it 'displays validation errors within the form' do
            expect(page).to have_content('Name is required.')
          end
        end

        context 'with valid values' do
          let(:name)        { 'Wolf 359 Edited' }
          let(:description) { 'Ea qui natus nobis, edited.' }

          before do
            fill_in 'Name', with: name
            fill_in 'Description', with: description

            within '#tag_guids_toList' do
              # Matthew's Test
              find('option[value="C1200019403-MMT_2"]').select_option
            end

            within '.button-container' do
              find('.remove_button').click
            end

            VCR.use_cassette('echo_soap/service_management_service/service_entries/update', record: :none) do
              within '#service-entry-form' do
                click_on 'Submit'
              end
            end
          end

          it 'updates the service entry and displays a confirmation message' do
            expect(page).to have_content('Service Entry successfully updated')
          end
        end
      end
    end
  end
end
