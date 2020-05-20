describe 'Service Drafts Forms Field Validations', js: true do
  let(:draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

  before do
    login
  end

  context 'required fields' do
    before do
      visit edit_service_draft_path(draft)
    end

    context 'when trying to submit a form with required fields' do
      context 'when the fields are empty' do
        before do
          within '.nav-top' do
            click_on 'Save'
          end
        end

        it 'displays a modal with a prompt about saving invalid data' do
          expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
        end

        context 'when choosing not to proceed' do
          before do
            within '#invalid-draft-modal' do
              click_on 'No'
            end
          end

          it 'displays the correct error messages at the top of the page' do
            within '.summary-errors' do
              expect(page).to have_content('Name is required')
              expect(page).to have_content('Long Name is required')
              expect(page).to have_content('Type is required')
              expect(page).to have_content('Version is required')
              expect(page).to have_content('Description is required')
            end
          end

          it 'displays the correct error messages under the form elements' do
            within '#service_draft_draft_name_error' do
              expect(page).to have_content('Name is required')
            end
            within '#service_draft_draft_long_name_error' do
              expect(page).to have_content('Long Name is required')
            end
            within '#service_draft_draft_type_error' do
              expect(page).to have_content('Type is required')
            end
            within '#service_draft_draft_version_error' do
              expect(page).to have_content('Version is required')
            end
            within '#service_draft_draft_description_error' do
              expect(page).to have_content('Description is required')
            end
          end
        end
      end

      context 'when the fields are filled' do
        before do
          within '#service-information' do
            fill_in 'Name', with: 'short_name'
            fill_in 'Long Name', with: 'Test Service Long Name'
            select 'NOT PROVIDED', from: 'Type'
            fill_in 'Version', with: '1.0'
            fill_in 'Description', with: 'Service Description'
          end

          within '.nav-top' do
            click_on 'Save'
          end
        end

        it 'saves the form without a modal prompt' do
          expect(page).to have_no_content('This page has invalid data. Are you sure you want to save it and proceed?')
          expect(page).to have_content('Service Draft Updated Successfully!')
        end

        it 'populates the form with the data' do
          expect(page).to have_field('Name', with: 'short_name')
          expect(page).to have_field('Long Name', with: 'Test Service Long Name')
          expect(page).to have_field('Type', with: 'NOT PROVIDED')
          expect(page).to have_field('Version', with: '1.0')
          expect(page).to have_field('Description', with: 'Service Description')
        end
      end
    end

    context 'when visiting required fields' do
      context 'when no data is entered into the field' do
        before do
          find('#service_draft_draft_name').click
          find('#service_draft_draft_long_name').click
          find('#service_draft_draft_version').click
        end

        it 'displays validation error messages' do
          expect(page).to have_css('.eui-banner--danger', count: 3)

          within '.summary-errors' do
            expect(page).to have_content('This draft has the following errors:')
            expect(page).to have_content('Name is required')
            expect(page).to have_content('Long Name is required')
          end

          expect(page).to have_css('#service_draft_draft_name_error', text: 'Name is required')
          expect(page).to have_css('#service_draft_draft_long_name_error', text: 'Long Name is required')
        end
      end

      context 'when data is entered into the field' do
        before do
          fill_in 'Name', with: 'short_name'
          fill_in 'Long Name', with: 'Test Service Long Name'
          fill_in 'Version', with: '1.0'
        end

        it 'does not display validation error messages' do
          expect(page).to have_no_css('.eui-banner--danger')
        end
      end
    end

    context 'when only filling out some of the required subfields of a required field' do
      before do
        visit edit_service_draft_path(draft, 'service_organizations')

        select 'ESA/ED', from: 'Short Name'

        within '.nav-top' do
          click_on 'Done'
        end
        click_on 'No'
      end

      it 'displays validation errors' do
        expect(page).to have_content('Roles is required')
      end

      context 'when viewing the show page' do
        before do
          within '.nav-top' do
            click_on 'Done'
          end
          click_on 'Yes'
        end

        it 'displays an invalid progress circle' do
          expect(page).to have_css('i.icon-red.service-organizations')
        end
      end
    end
  end

  context 'number fields' do
    before do
      visit edit_service_draft_path(draft, 'operation_metadata')
    end

    context 'when entering text into a number field' do
      before do
        fill_in 'Spatial Resolution', with: 'abcd'

        find('body').click
      end

      it 'displays validation error messages' do
        expect(page).to have_css('.eui-banner--danger', count: 2)

        within '.summary-errors' do
          expect(page).to have_content('Spatial Resolution must be of type number')
        end

        expect(page).to have_css('#service_draft_draft_operation_metadata_0_coupled_resource_data_resource_spatial_resolution_error', text: 'Spatial Resolution must be of type number')
      end

      context 'when saving the form' do
        before do
          within '.nav-top' do
            click_on 'Save'
          end
        end

        it 'displays a modal with a prompt about saving invalid data' do
          expect(page).to have_content('This page has invalid data. Are you sure you want to save it and proceed?')
        end

        context 'when returning to the form with invalid data' do
          before do
            click_on 'Yes'
          end

          it 'displays validation error messages for fields with data' do
            within '.summary-errors' do
              expect(page).to have_content('Spatial Resolution must be of type number')
            end

            expect(page).to have_css('#service_draft_draft_operation_metadata_0_coupled_resource_data_resource_spatial_resolution_error', text: 'Spatial Resolution must be of type number')
          end
        end
      end
    end
  end

  context 'multiple fields' do
    before do
      visit edit_service_draft_path(draft, 'service_organizations')
    end

    context 'when adding a new set of multiple fields' do
      before do
        select 'DEVELOPER', from: 'Roles', match: :first
        select 'AARHUS-HYDRO', from: 'Short Name'

        click_on 'Add another Service Organization'
      end

      it 'does not show validation errors for the new fields' do
        expect(page).to have_no_css('.summary-errors')
        expect(page).to have_no_content('Short Name is required')
      end
    end
  end

  context 'fields that break snake_case and CamelCase conversions' do
    before do
      visit edit_service_draft_path(draft, 'operation_metadata')
    end

    context 'when entering when only filling out some fields that will require other fields' do
      before do
        select 'GENERAL_GRID', from: 'Data Resource Spatial Type'

        within '.multiple.axes' do
          fill_in 'Upper Bound', with: '20'
        end
      end

      context 'when saving the form but not confirming' do
        before do
          within '.nav-top' do
            click_on 'Save'
          end

          click_on 'No'
        end

        it 'displays validation error messages including fields with names that break conversion' do
          within '.summary-errors' do
            expect(page).to have_content('CRS Identifier is required')
            expect(page).to have_content('Axis Label is required')
            expect(page).to have_content('Lower Bound is required')
            expect(page).to have_content('UOM Label is required')
          end

          expect(page).to have_css('#service_draft_draft_operation_metadata_0_coupled_resource_data_resource_data_resource_spatial_extent_general_grid_crs_identifier_error', text: 'CRS Identifier is required')
          expect(page).to have_css('#service_draft_draft_operation_metadata_0_coupled_resource_data_resource_data_resource_spatial_extent_general_grid_axis_0_axis_label_error', text: 'Axis Label is required')
          expect(page).to have_css('#service_draft_draft_operation_metadata_0_coupled_resource_data_resource_data_resource_spatial_extent_general_grid_axis_0_extent_lower_bound_error', text: 'Lower Bound is required')
          expect(page).to have_css('#service_draft_draft_operation_metadata_0_coupled_resource_data_resource_data_resource_spatial_extent_general_grid_axis_0_extent_uom_label_error', text: 'UOM Label is required')
        end

        context 'when filling out the required data' do
          before do
            within '.data-resource-spatial-extent.general-grid' do
              select '26917', from: 'CRS Identifier'

              within '.multiple.axes' do
                fill_in 'Axis Label', with: 'x'
                fill_in 'Lower Bound', with: '0.0'
                fill_in 'Upper Bound', with: '2918.0'
                fill_in 'UOM Label', with: 'Meters'

                find('#service_draft_draft_operation_metadata_0_coupled_resource_data_resource_data_resource_spatial_extent_general_grid_axis_0_extent_upper_bound').click
              end
            end
          end

          it 'does not display validation error messages' do
            expect(page).to have_no_css('.eui-banner--danger')
          end
        end
      end
    end
  end
end
