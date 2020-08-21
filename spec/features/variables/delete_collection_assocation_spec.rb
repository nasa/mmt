describe 'Deleting Variable Collection Associations', js: true, reset_provider: true do
  before do
    login

    @variable_ingest_response, _concept_response = publish_variable_draft

    create_variable_collection_association(@variable_ingest_response['concept-id'], @ingest_response1['concept-id'])
  end

  before :all do
    @ingest_response1, _concept_response1 = publish_collection_draft(entry_title: 'MODIS-I Water Traveler')
  end

  context 'When viewing the associated collection page' do
    before do
      visit variable_collection_associations_path(@variable_ingest_response['concept-id'])
    end

    it 'shows the associated collection' do
      within '#collection-associations' do
        expect(page).to have_selector('tbody > tr', count: 1)

        within 'tbody tr:nth-child(1)' do
          expect(page).to have_content('MODIS-I Water Traveler')
        end
      end
    end

    context 'When submitting the form with 1 value selected' do
      before do
        find("input[value='#{@ingest_response1['concept-id']}']").set(true)

        click_link 'Delete Selected Association'
      end

      it 'displays an appropriate warning about association cascade deleting a variable' do
        expect(page).to have_content('Deleting a variable association will also delete the associated variable. If you wish to associate this variable to a different collection, before deleting this association, you should clone the associated variable and associate the clone to the correct collection.')
      end

      it 'displays an appropriate confirmation message' do
        expect(page).to have_content('Are you sure you want to delete the selected collection association')
        expect(page).to have_link('clone the associated variable', href: clone_variable_path(id: @variable_ingest_response['concept-id']))
      end

      context 'when clicking the clone link in the modal' do
        before do
          click_on 'clone the associated variable'
        end

        it 'displays the draft preview page' do
          # Clone link opens a new tab in this case, this switches to that tab
          within_window(switch_to_window(windows.last)) do
            within '.eui-breadcrumbs' do
              expect(page).to have_content('Variable Drafts')
            end

            expect(page).to have_content('Publish Variable Draft')
            expect(page).to have_content('Delete Variable Draft')
            expect(page).to have_content('Metadata Fields')
            expect(page).to have_content('Variable Information')
          end
        end

        it 'removes the Name and Long Name from the metadata' do
          within_window(switch_to_window(windows.last)) do
            within '#variable_draft_draft_name_preview' do
              expect(page).to have_css('p', text: 'No value for Name provided.')
            end

            within '#variable_draft_draft_long_name_preview' do
              expect(page).to have_css('p', text: 'No value for Long Name provided.')
            end
          end
        end

        it 'displays a message that the draft needs a unique Name' do
          within_window(switch_to_window(windows.last)) do
            expect(page).to have_content('Records must have a unique Name and Long Name within a provider. Click here to enter a new Name and Long Name.')
          end
        end

        it 'does not close the delete modal' do
          expect(page).to have_content('Deleting a variable association will also delete the associated variable. If you wish to associate this variable to a different collection, before deleting this association, you should clone the associated variable and associate the clone to the correct collection.')
        end
      end

      context 'When clicking Yes on the confirmation dialog' do
        before do
          click_on 'Yes'
        end

        it 'removes the association' do
          expect(page).to have_content('Collection Association Deleted Successfully!')
        end

        context 'When clicking the refresh link' do
          before do
            wait_for_cmr

            click_link 'refresh the page'
          end

          it 'reloads the page and displays no associations' do
            within '#collection-associations' do
              expect(page).to have_selector('tbody > tr', count: 1)
              expect(page).to have_content('No Collection Association found.')

              expect(page).to have_no_content('MODIS-I Water Skipper')
              expect(page).to have_no_content('MODIS-I Water Traveler')
            end
          end
        end
      end
    end
  end
end
